import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { userController } from "../container.js";

const userRouter = Router();

userRouter.get("/home", 
  verifyToken, 
  authorize("user"), 
  userController.home
);
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
userRouter.get("/list-tokens", 
  verifyToken, 
  authorize("user"), 
  userController.listRefreshTokens
);

export default userRouter;