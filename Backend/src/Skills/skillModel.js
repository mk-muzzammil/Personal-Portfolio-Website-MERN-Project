import mongoose from "mongoose";
const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  proficiency: {
    type: String,
    required: [true, "proficiency is required"],
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
