import express from "express";
const app = express();
import cors from "cors";
import { config } from "./config/config.js";
import userRouter from "./Users/userRouter.js";
app.use(
  cors({
    origin: [config.PORTFOLIO_FRONTEND_URL, config.Dashboard_FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/users", userRouter);

export default app;
