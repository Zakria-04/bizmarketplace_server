import { Router } from "express";
import { createNewListing } from "../controller/listing.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const listingRouter = Router();

listingRouter.post("/createNewListing", authenticateToken, createNewListing);

export default listingRouter;
