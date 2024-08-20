import mongoose from "mongoose";
const Schema = mongoose.Schema;

const softwareSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  image: {
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
export default mongoose.model("Software", softwareSchema);
