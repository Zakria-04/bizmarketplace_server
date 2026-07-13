import { Router } from "express";
import authRouter from "./auth.routes";
import listingRouter from "./listing.routes";
const Routes = Router();

Routes.use("/auth", authRouter);
Routes.use("/listing", listingRouter);

export default Routes;
