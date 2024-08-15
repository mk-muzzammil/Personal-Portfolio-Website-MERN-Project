import express from "express";
const app = express();
import cors from "cors";
import { config } from "./config/config.js";
import userRouter from "../src/Users/userRouter.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { globalErrorMiddleware } from "./middlewares/globalErrorHandler.js";
import messageRouter from "../src/Messages/messageRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  cors({
    origin: [config.PORTFOLIO_FRONTEND_URL, config.Dashboard_FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(
  multer({
    dest: path.resolve(__dirname, "../public/data/uploads"),
    limits: {
      fileSize: 1000000,
    },
  }).fields(["avatar", "resume"])
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);

app.use(globalErrorMiddleware);
export default app;
