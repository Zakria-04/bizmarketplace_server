import { Request, Response, NextFunction } from "express";
import { ListingModelType } from "../../types/listing.type";
import Listing_MODEL from "../model/listing.model";
import USER_MODEL from "../model/user.model";
import handleResponse from "../../utils/handleResponse";

const createNewListing = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, description, tags, primaryCta, links } =
    req.body as ListingModelType;
  const owner = req?.authUser?._id;

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

    const newListing = await Listing_MODEL.create({
      owner,
      title,
      description,
      tags,
      links,
      primaryCta,
    });
    return handleResponse(res, 201, "Listing created successfully", {
      data: newListing,
    });
  } catch (error) {
    next(error);
  }
};

export { createNewListing };
