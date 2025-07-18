import dotenv from "dotenv";
import App from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = new App();

app.start(PORT);
