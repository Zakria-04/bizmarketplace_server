import { Router } from "express";
import { login, register, refreshAccessToken } from "../controller/auth.controller";
import validateUserInputs from "../middlewares/inputValidator.middleware";

const authRouter = Router();

authRouter.post("/register", validateUserInputs, register);
authRouter.post("/login", login);
authRouter.post("/refresh-token", refreshAccessToken);

export default authRouter;
