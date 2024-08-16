import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  doLogout,
  postCreateUser,
  postLogin,
  getUser,
  updateProfile,
  updatePassword,
  getUserForPortfolio,
  forgotPassword,
} from "./userController.js";
import tokenVerification from "../middlewares/tokenVerification.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadMulter = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});
const userRouter = express.Router();

userRouter.post(
  "/create_user",
  uploadMulter.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  postCreateUser
);
userRouter.patch(
  "/updateProfile",
  tokenVerification,
  uploadMulter.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateProfile
);
userRouter.post("/login", postLogin);
userRouter.post("/updatePassword", tokenVerification, updatePassword);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.get("/myProfile", tokenVerification, getUser);
userRouter.get("/me/data", getUserForPortfolio);
userRouter.get("/logout", tokenVerification, doLogout);

export default userRouter;
