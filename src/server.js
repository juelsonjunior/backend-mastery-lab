import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./database/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

//Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api",routes);

connectDb()
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(port, () => console.log(`Server is on port ${port}`));
  })
  .catch((err) => {
    console.error("Erro ao conecatr ao Mongo:", err);
    process.exit(1);
  });
