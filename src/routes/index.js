import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import userController from "../controllers/userController.js";
import authController from "../controllers/authController.js";
import adminController from "../controllers/adminController.js";

const router = Router();

//Autenticação
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/refresh", authController.refresh);
router.post("/logout", authController.logout);

//Acções privadas USER
router.post(
  "/profile",
  verifyToken,
  authorize("user"),
  userController.profile
);
router.patch(
  "/updated-password",
  verifyToken,
  authorize("user"),
  userController.updatedPassword
);
router.delete(
  "/delete-account",
  verifyToken,
  authorize("user"),
  userController.deleteAccount
);
router.get("/home", 
  verifyToken, 
  authorize("user"), 
  userController.Home
);
router.get("/list-tokens", 
  verifyToken, 
  authorize("user"), 
  userController.listRefreshTokens
);

//Acções privadas ADMIN OR MOD
router.get(
  "/dashboard",
  verifyToken,
  authorize("admin", "mod"),
  adminController.dashBoardAdmin
);
router.patch(
  "/disabled-user/:id",
  verifyToken,
  authorize("admin"),
  adminController.disabledUser
);

export default router;
