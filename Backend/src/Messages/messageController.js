import customeError from "../middlewares/globalErrorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
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
const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const messageId = req.params.messageId;
  const message = await Message.findById(messageId);
  if (!message) {
    return next(new customeError("Message not found", 200));
  }
  if (!req.user.id) {
    return next(new customeError("Unauthorized access", 401));
  }
  const deletionResult = await Message.deleteOne({ _id: messageId });
  if (deletionResult.deletedCount === 0) {
    return next(new customeError("Message deletion failed", 500));
  }
  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
  });
});
const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find();
  if (!messages) {
    return next(new customeError("No messages found", 200));
  }
  res.status(200).json({
    success: true,
    data: messages,
  });
});

export { sendMessage, getAllMessages, deleteMessage };
