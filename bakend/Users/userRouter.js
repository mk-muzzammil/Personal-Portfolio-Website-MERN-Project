import express from "express";
const userRouter = express.Router();
import { postCreateUser } from "./userController.js";

userRouter.post("/create_User", postCreateUser);
// userRouter.post("/edit_User", postEditUser);

export default userRouter;
