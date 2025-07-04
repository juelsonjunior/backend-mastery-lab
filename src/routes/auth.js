import { Router } from "express";
import authController from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.get("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);

export default authRouter;
