import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import cors from "cors";
import connectDb from "./database/db.js";

export default class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(cors({ origin: "http://localhost:3000", credentials: true }));
    this.app.use(cookieParser());
  }

  routes() {
    this.app.use("/api", routes);
  }

  async start(port) {
    try {
      await connectDb();

      this.app.listen(port, () => console.log(`Server is on port ${port}`));
    } catch (err) {
      console.error("Erro ao conecatr ao Mongo:", err);
      process.exit(1);
    }
  }
}
