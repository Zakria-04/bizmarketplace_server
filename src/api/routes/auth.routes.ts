import { Router } from "express";
import { login, register, refreshAccessToken } from "../controller/auth.controller";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh-token", refreshAccessToken);

export default authRouter;
