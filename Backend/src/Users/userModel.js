import mongoose from "mongoose";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import customeError from "../middlewares/globalErrorHandler.js";
// import { config } from "../config/config.js";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
    trim: true,
    isEmail: [true, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be atleast 8 characters long"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  resume: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone Number is required"],
  },
  aboutMe: {
    type: String,
    required: [true, "About me is required"],
  },
  portfolioUrl: {
    type: String,
    required: [true, "Portfolio URL is required"],
  },
  gitHubUrl: String,
  facebookUrl: String,
  instagramUrl: String,
  linkedInUrl: String,
  resetpasswordToken: String,
  resetpasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);
