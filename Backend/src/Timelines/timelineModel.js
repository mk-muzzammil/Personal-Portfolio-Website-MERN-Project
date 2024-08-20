import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TimelineSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Title is required"],
  },
  Timeline: {
    from: {
      type: String,
      required: [true, "From is required"],
    },
    to: {
      type: String,
      required: [true, "To is required"],
    },
  },
});
export default mongoose.model("Timeline", TimelineSchema);
