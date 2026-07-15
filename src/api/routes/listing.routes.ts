import { Router } from "express";
import {
  createNewListing,
  deleteListing,
  getAllListings,
  getUserListings,
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
listingRouter.get("/getUserListings", authenticateToken, getUserListings);
listingRouter.delete("/deleteListing/:id", authenticateToken, deleteListing);

export default listingRouter;
