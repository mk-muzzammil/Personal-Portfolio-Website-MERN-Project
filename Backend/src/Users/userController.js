import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import customeError from "../middlewares/globalErrorHandler.js";
import User from "./userModel.js";
import cloudinary from "../config/cloudinaryConfig.js";
import fs from "fs";
const uploadToCloudinary = async (filePath, folderName, resourceType) => {
  return await cloudinary.uploader.upload(filePath, {
    folderName: folderName,
    resource_type: resourceType,
  });
};

// const postCreateUser = (req, res, next) => {
//   console.log("Requested Files", req.files);
//   console.log(req.body);
//   res.json({ message: "User Created Successfully" });
// };
const postCreateUser = catchAsyncErrors(async (req, res, next) => {
  if (!req.files && Object.keys(req.files).length === 0) {
    return next(new customeError("Avatar and Resume is required", 400));
  }
  const { avatar, resume } = req.files;
  // const avatarFileName = avatar[0].filename;
  // const resumeFileName = resume[0].filename;
  const avatarFilePath = avatar[0].path;
  const resumeFilePath = resume[0].path;

  try {
    const avatarRes = await uploadToCloudinary(
      avatarFilePath,
      "Avatars",
      "image"
    );
    const resumeRes = await uploadToCloudinary(
      resumeFilePath,
      "Resumes",
      "raw"
    );
    if (!avatarRes || avatarRes.error || !resumeRes || resumeRes.error) {
      console.error("Avatar Upload Error", avatarRes.error);
    }
    const {
      fullName,
      email,
      password,
      phoneNumber,
      aboutMe,
      portfolioUrl,
      gitHubUrl,
      facebookUrl,
      instagramUrl,
      linkedInUrl,
    } = req.body;
    if (!fullName || !email || !password || !phoneNumber || !aboutMe) {
      return next(new customeError("Please fill all fields", 400));
    }
    console.log("Avatar Response", avatarRes, "Resume Response", resumeRes);
    const avatarData = {
      public_id: avatarRes.public_id,
      url: avatarRes.secure_url,
    };
    const resumeData = {
      public_id: resumeRes.public_id,
      url: resumeRes.secure_url,
    };

    const userData = await User.create({
      fullName,
      email,
      password,
      phoneNumber,
      aboutMe,
      portfolioUrl,
      gitHubUrl,
      facebookUrl,
      instagramUrl,
      linkedInUrl,
      avatar: avatarData,
      resume: resumeData,
    });
    fs.unlink(avatarFilePath, (err) => {
      if (err) console.log(err);
    });
    fs.unlink(resumeFilePath, (err) => {
      if (err) console.log(err);
    });

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    return next(new customeError("Something went wrong", 500));
  }
});

export { postCreateUser };
