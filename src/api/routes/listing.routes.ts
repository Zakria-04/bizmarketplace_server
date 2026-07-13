import { Router } from "express";
import {
  createNewListing,
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
listingRouter.put(
  "/updateListing/:listingId",
  authenticateToken,
  updateListing,
);

export default listingRouter;
