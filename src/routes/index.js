import express from "express";
import userRouter from "./user.js";
import authRouter from "./auth.js";
import adminRouter from "./admin.js";

const routers = express();

routers.use("/users", userRouter);
routers.use("/auth", authRouter);
routers.use("/admin", adminRouter);

export default routers;
