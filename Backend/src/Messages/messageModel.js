import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minLength: [2, "Message must be atleast 2 characters long"],
  },
  senderName: {
    type: String,
    required: true,
    minLength: [2, "Name must be atleast 2 characters long"],
  },
  subject: {
    type: String,
    required: true,
    minLength: [2, "Subject must be atleast 2 characters long"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Message", messageSchema);
