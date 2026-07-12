import { Router } from "express";
import authRouter from "./auth.routes";

const Routes = Router();

Routes.use("/auth", authRouter);

export default Routes;
