import { Router } from "express";
import adminController from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

const adminRouter = Router();

adminRouter.get(
  "/dashboard",
  verifyToken,
  authorize("admin", "mod"),
  adminController.dashBoardAdmin
);
adminRouter.patch(
  "/disabled-user/:id",
  verifyToken,
  authorize("admin"),
  adminController.disabledUser
);

export default adminRouter;
