import { Router } from "express";
import userController from "../controllers/userController.js";
import { verifyToken } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

const userRouter = Router();

userRouter.post(
  "/profile",
  verifyToken,
  authorize("user"),
  userController.profile
);
userRouter.patch(
  "/updated-password",
  verifyToken,
  authorize("user"),
  userController.updatedPassword
);
userRouter.delete(
  "/delete-account",
  verifyToken,
  authorize("user"),
  userController.deleteAccount
);
userRouter.get("/home", 
  verifyToken, 
  authorize("user"), 
  userController.Home
);
userRouter.get("/list-tokens", 
  verifyToken, 
  authorize("user"), 
  userController.listRefreshTokens
);

export default userRouter;