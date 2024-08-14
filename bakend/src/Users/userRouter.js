import express from "express";
import { postLogin, postSignUp } from "./userController.js";
const userRouter = express.Router();

userRouter.post("/signup", postSignUp);
userRouter.post("/login", postLogin);

export default userRouter;
