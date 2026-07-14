import { Router } from "express";
import {
  createNewListing,
  getAllListings,
  updateListing,
} from "../controller/listing.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import upload from "../middlewares/upload.middleware";

const listingRouter = Router();

listingRouter.post(
  "/createNewListing",
  authenticateToken,
  upload.single("image"),
  createNewListing,
);
listingRouter.patch(
  "/updateListing/:listingId",
  authenticateToken,
  upload.single("image"),
  updateListing,
);
listingRouter.get("/getAllListings", getAllListings);

export default listingRouter;
