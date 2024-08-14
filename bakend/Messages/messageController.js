import customeError from "../src/middlewares/globalErrorHandler.js";
import catchAsyncErrors from "../src/middlewares/catchAsyncErrors.js";
import Message from "./messageModel.js";

const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { message, senderName, subject } = req.body;

  if (!message || !senderName || !subject) {
    return next(new customeError("Please fill all fields ", 403));
  }
  const messageData = await Message.create({ message, senderName, subject });

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: messageData,
  });
});

export { sendMessage };
