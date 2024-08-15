import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadMulter = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});
const userRouter = express.Router();
import { postCreateUser, postLogin } from "./userController.js";

userRouter.post(
  "/create_user",
  uploadMulter.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  postCreateUser
);
userRouter.post("/login", postLogin);

export default userRouter;
