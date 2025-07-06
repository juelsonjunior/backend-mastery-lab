import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { adminController } from "../container.js";

const adminRouter = Router();

adminRouter.get(
  "/dashboard",
  verifyToken,
  authorize("admin", "mod"),
  adminController.homeAdmin
);
adminRouter.patch(
  "/disabled-user/:id",
  verifyToken,
  authorize("admin"),
  adminController.disabledUser
);

export default adminRouter;
