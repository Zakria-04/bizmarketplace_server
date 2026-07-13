import { Request, Response, NextFunction } from "express";
import { ListingModelType } from "../../types/listing.type";
import Listing_MODEL from "../model/listing.model";
import USER_MODEL from "../model/user.model";
import handleResponse from "../../utils/handleResponse";
import {
  deleteCloudinaryImage,
  streamUpload,
} from "../services/cloudinary.service";

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

    const newListing = new Listing_MODEL({
      owner,
      title,
      description,
      tags,
      links,
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

export default createNewListing;

const updateListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { listingId } = req.params;
  const { title, description, tags, primaryCta, links } =
    req.body as ListingModelType;
  const owner = req?.authUser?._id;

  try {
    // Check if the listing exists and belongs to the authenticated user
    const listing = await Listing_MODEL.findById(listingId);
    if (!listing || listing.owner.toString() !== owner?.toString()) {
      return handleResponse(res, 404, "Listing not found or unauthorized", {
        errorCode: "LISTING_NOT_FOUND",
      });
    }

    const updatedListing = await Listing_MODEL.findByIdAndUpdate(
      listingId,
      { title, description, tags, primaryCta, links },
      { new: true },
    );
    return handleResponse(res, 200, "Listing updated successfully", {
      data: updatedListing,
    });
  } catch (error) {
    next(error);
  }
};

export { createNewListing, updateListing };
