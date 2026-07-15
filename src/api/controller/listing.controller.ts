import { Request, Response, NextFunction } from "express";
import { ListingModelType } from "../../types/listing.type";
import Listing_MODEL from "../model/listing.model";
import USER_MODEL from "../model/user.model";
import handleResponse from "../../utils/handleResponse";
import {
  deleteCloudinaryImage,
  streamUpload,
  UploadedImage,
} from "../services/cloudinary.service";
import { Types } from "mongoose";

const createNewListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, description, tags, primaryCta, links } =
    req.body as ListingModelType;

  const owner = req.authUser?._id;
  let uploadedPublicId: string | undefined;

  try {
    // Check if the owner exists in the database
    const userExists = await USER_MODEL.findById(owner);

    if (!userExists) {
      return handleResponse(res, 404, "Owner not found", {
        errorCode: "USER_NOT_FOUND",
      });
    }

    // Check if the user already has a listing
    const existingListing = await Listing_MODEL.findOne({ owner });

    if (existingListing) {
      return handleResponse(res, 400, "User already has a listing", {
        errorCode: "LISTING_ALREADY_EXISTS",
      });
    }

    // Check if an image was uploaded
    const imageBuffer = req.file?.buffer;

    if (!imageBuffer) {
      return handleResponse(res, 400, "Listing image is required", {
        errorCode: "IMAGE_REQUIRED",
      });
    }

    // Upload the image to Cloudinary
    const uploadedImage = await streamUpload(imageBuffer, "listing_images");

    uploadedPublicId = uploadedImage.publicId;

    // parse the tags and links
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    const parsedLinks = typeof links === "string" ? JSON.parse(links) : links;

    const newListing = new Listing_MODEL({
      owner,
      title,
      description,
      tags: parsedTags,
      links: parsedLinks,
      primaryCta,
    });

    // Save the Cloudinary URL and public ID
    newListing.images.push(uploadedImage);

    await newListing.save();

    uploadedPublicId = undefined;

    return handleResponse(res, 201, "Listing created successfully", {
      data: newListing,
    });
  } catch (error) {
    // Delete the image if MongoDB failed to save the listing
    if (uploadedPublicId) {
      try {
        await deleteCloudinaryImage(uploadedPublicId);
      } catch (cleanupError) {
        console.error(
          "Failed to remove unused Cloudinary image:",
          cleanupError,
        );
      }
    }

    next(error);
  }
};

const updateListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const listingId = req.params.listingId;
  const owner = req.authUser?._id;

  let newImagePublicId: string | undefined;

  try {
    if (!owner) {
      return handleResponse(res, 401, "Unauthorized", {
        errorCode: "UNAUTHORIZED",
      });
    }

    if (typeof listingId !== "string" || !Types.ObjectId.isValid(listingId)) {
      return handleResponse(res, 400, "Invalid listing ID", {
        errorCode: "INVALID_LISTING_ID",
      });
    }

    const listingFilter = {
      _id: new Types.ObjectId(listingId),
      owner,
    };

    const listing = await Listing_MODEL.findOne(listingFilter).select("images");

    if (!listing) {
      return handleResponse(res, 404, "Listing not found or unauthorized", {
        errorCode: "LISTING_NOT_FOUND",
      });
    }

    const { title, description, tags, primaryCta, links, approvalStatus } =
      req.body ?? {};

    const imageBuffer = req.file?.buffer;

    const uploadedImage = imageBuffer
      ? await streamUpload(imageBuffer, "listing_images")
      : undefined;

    newImagePublicId = uploadedImage?.publicId;

    const oldImagePublicId = uploadedImage
      ? listing.images[0]?.publicId
      : undefined;

    // parse the tags and links if they are strings
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    const parsedLinks = typeof links === "string" ? JSON.parse(links) : links;

    const updatedListing = await Listing_MODEL.findOneAndUpdate(
      listingFilter,
      {
        $set: {
          title,
          description,
          tags: parsedTags,
          primaryCta,
          links: parsedLinks,
          ...(uploadedImage && {
            images: [uploadedImage],
          }),
          ...(approvalStatus && {
            approvalStatus,
          }),
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedListing) {
      throw new Error("Listing disappeared while being updated");
    }

    // The new image is now connected to the saved listing.
    newImagePublicId = undefined;

    if (oldImagePublicId) {
      await deleteCloudinaryImage(oldImagePublicId).catch((cleanupError) => {
        console.error("Failed to delete old Cloudinary image:", cleanupError);
      });
    }

    return handleResponse(res, 200, "Listing updated successfully", {
      data: updatedListing,
    });
  } catch (error) {
    if (newImagePublicId) {
      await deleteCloudinaryImage(newImagePublicId).catch((cleanupError) => {
        console.error(
          "Failed to delete unused Cloudinary image:",
          cleanupError,
        );
      });
    }

    next(error);
  }
};

const getAllListings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const listings = await Listing_MODEL.find();
    return handleResponse(res, 200, "Listings retrieved successfully", {
      data: listings,
    });
  } catch (error) {
    next(error);
  }
};

const getUserListings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const owner = req.authUser?._id;
  try {
    const listings = await Listing_MODEL.find({ owner });
    return handleResponse(res, 200, "User listings retrieved successfully", {
      data: listings,
    });
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const listingId = req.params.id;
  try {
    const deletedListing = await Listing_MODEL.findByIdAndDelete(listingId);
    if (!deletedListing) {
      throw new Error("Listing not found");
    }
    if (deletedListing.images[0]?.publicId) {
      await deleteCloudinaryImage(deletedListing.images[0].publicId).catch(
        (cleanupError) => {
          console.error("Failed to delete Cloudinary image:", cleanupError);
        },
      );
    }
    return handleResponse(res, 200, "Listing deleted successfully", {
      data: deletedListing,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createNewListing,
  updateListing,
  getAllListings,
  getUserListings,
  deleteListing,
};
