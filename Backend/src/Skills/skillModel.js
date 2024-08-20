import mongoose from "mongoose";
const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  svgIcon: {
    public_id: {
      type: String,
      required: [true, "Image is required"],
    },
    url: {
      type: String,
      required: [true, "Image is required"],
    },
  },
});
export default mongoose.model("Skill", skillSchema);
