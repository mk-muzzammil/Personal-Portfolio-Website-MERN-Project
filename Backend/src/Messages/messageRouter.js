import express from "express";
import {
  //   deleteMessage,
  sendMessage,
  getAllMessages,
} from "./messageController.js";
import tokenVerification from "../middlewares/tokenVerification.js";

const messageRouter = express.Router();

messageRouter.post("/sendMessage", sendMessage);
// messageRouter.delete("/:messageId", tokenVerification, deleteMessage);
messageRouter.get("/getAllMessages", tokenVerification, getAllMessages);
export default messageRouter;
