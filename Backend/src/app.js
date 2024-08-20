import express from "express";
const app = express();
import cors from "cors";
import { config } from "./config/config.js";
import userRouter from "../src/Users/userRouter.js";
import cookieParser from "cookie-parser";

import { globalErrorMiddleware } from "./middlewares/globalErrorHandler.js";
import messageRouter from "../src/Messages/messageRouter.js";
import timelineRouter from "./Timelines/timelinRouter.js";
import softwareRouter from "./Softwares/softwareRouter.js";

app.use(
  cors({
    origin: [config.PORTFOLIO_FRONTEND_URL, config.Dashboard_FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/timelines", timelineRouter);
app.use("/api/softwares", softwareRouter);

app.use(globalErrorMiddleware);
export default app;
