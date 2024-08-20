import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  projectBanner: {
    public_id: {
      type: String,
      required: [true, "Image is required"],
    },
    url: {
      type: String,
      required: [true, "Image is required"],
    },
  },
  technologies: {
    type: [String],
    required: [true, "Technologies is required"],
  },
  projectLink: {
    type: String,
  },
  githubLink: {
    type: String,
    required: [true, "Github Link is required"],
  },
  stack: {
    type: [String],
    required: [true, "Stack is required"],
  },
  deployed: {
    type: String,
    required: [true, "Deployment is required"],
  },
});
export default mongoose.model("Project", projectSchema);
