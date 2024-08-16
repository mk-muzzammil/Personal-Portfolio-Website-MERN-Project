import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import customeError from "../middlewares/globalErrorHandler.js";
import User from "./userModel.js";
import cloudinary from "../config/cloudinaryConfig.js";
import fs from "fs";
import jwtTokenGeneration from "../utils/jwtTokenGeneration.js";
import bcrypt from "bcrypt";
import { config } from "../config/config.js";
import { sendEmail } from "../utils/sendEmail.js";
const uploadToCloudinary = async (
  filePath,
  folderName,
  resourceType,
  fileFormat
) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: folderName,
    resource_type: resourceType,
    format: fileFormat,
  });
};
const deleteFromCloudinary = async (publicId, resourceType) => {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};

const postCreateUser = catchAsyncErrors(async (req, res, next) => {
  if (!req.files && Object.keys(req.files).length === 0) {
    return next(new customeError("Avatar and Resume is required", 400));
  }
  const { avatar, resume } = req.files;
  console.log(req.files);
  // const avatarFileName = avatar[0].filename;
  // const resumeFileName = resume[0].filename;
  const avatarFilePath = avatar[0].path;
  const avatarFileFormat = avatar[0].mimetype.split("/")[1];
  const resumeFileFormat = resume[0].mimetype.split("/")[1];
  const resumeFilePath = resume[0].path;

  try {
    const avatarRes = await uploadToCloudinary(
      avatarFilePath,
      "Avatars",
      "image",
      avatarFileFormat
    );
    const resumeRes = await uploadToCloudinary(
      resumeFilePath,
      "Resumes",
      "raw",
      resumeFileFormat
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

    jwtTokenGeneration(userData, "User Registered Succesfully", 201, res, next);
  } catch (error) {
    console.log(error);
    return next(new customeError("Something went wrong", 500));
  }
});
const postLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new customeError("Please provide email and password", 403));
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new customeError("No User found with this Email", 401));
    }
    const isPasswordVerified = await bcrypt.compare(password, user.password);
    if (!isPasswordVerified) {
      return next(new customeError("Invalid Password ", 401));
    }
    jwtTokenGeneration(user, "User Logged in Successfully", 200, res, next);
  } catch (error) {
    console.log(error);
    return next(new customeError("Something went wrong", 500));
  }
});
const doLogout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});
const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new customeError("User not found", 200));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new customeError("User not found With this id", 200));
  }
  let avatarFileUpdated = user.avatar;
  let resumeFileUpdated = user.resume;
  if (req.files) {
    if (req.files.avatar) {
      const avatarFilePath = req.files.avatar[0].path;
      const avatarFileFormat = req.files.avatar[0].mimetype.split("/")[1];
      const oldAvatarpublicId = user.avatar.public_id;
      await deleteFromCloudinary(oldAvatarpublicId, "image");

      const avatarCloudinaryResponse = await uploadToCloudinary(
        avatarFilePath,
        "Avatars",
        "image",
        avatarFileFormat
      );
      if (!avatarCloudinaryResponse || avatarCloudinaryResponse.error) {
        return next(new customeError("Avatar Upload Failed", 500));
      }
      avatarFileUpdated = {
        public_id: avatarCloudinaryResponse.public_id,
        url: avatarCloudinaryResponse.secure_url,
      };
      fs.unlink(avatarFilePath, (err) => {
        if (err) console.log(err);
      });
    }
    if (req.files.resume) {
      const resumeFilePath = req.files.resume[0].path;
      const resumeFileFormat = req.files.resume[0].mimetype.split("/")[1];
      const oldResumepublicId = user.resume.public_id;
      const deletionResult = await deleteFromCloudinary(
        oldResumepublicId,
        "raw"
      );
      if (deletionResult.result !== "ok") {
        return next(new customeError("Resume deletion failed", 500));
      }
      const resumeCloudinaryResponse = await uploadToCloudinary(
        resumeFilePath,
        "Resumes",
        "raw",
        resumeFileFormat
      );
      if (!resumeCloudinaryResponse || resumeCloudinaryResponse.error) {
        return next(new customeError("Resume Upload Failed", 500));
      }
      resumeFileUpdated = {
        public_id: resumeCloudinaryResponse.public_id,
        url: resumeCloudinaryResponse.secure_url,
      };
      fs.unlink(resumeFilePath, (err) => {
        if (err) console.log(err);
      });
    }
  }
  const {
    fullName,
    email,
    phoneNumber,
    aboutMe,
    portfolioUrl,
    gitHubUrl,
    facebookUrl,
    instagramUrl,
    linkedInUrl,
  } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      fullName,
      email,
      phoneNumber,
      aboutMe,
      portfolioUrl,
      gitHubUrl,
      facebookUrl,
      instagramUrl,
      linkedInUrl,
      avatar: avatarFileUpdated,
      resume: resumeFileUpdated,
    },
    { new: true, runValidators: true }
  );
  // if (!updatedUser) {
  //   return next(new customeError("User Update Failed", 500));
  // }
  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    data: updatedUser,
  });
});

const updatePassword = catchAsyncErrors(async (req, res, next) => {
  let { currentPassword, newPassword, confirmNewPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new customeError("User not found with this id", 200));
  }
  const isPasswordMatched = await bcrypt.compare(
    currentPassword,
    user.password
  );
  if (!isPasswordMatched) {
    return next(new customeError("Invalid password Entered", 403));
  }
  if (newPassword !== confirmNewPassword) {
    return next(
      new customeError(
        "New Password and confirm new password does not match",
        403
      )
    );
  }
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Updated Successfully",
  });
});
const getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
  const userId = "66be8c410461839ffe079047";
  const user = await User.findById(userId);
  if (!user) {
    return next(new customeError("User not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "User Extracted For portfolio",
    data: user,
  });
});
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const user = await user.find({ email: email });
  if (!user) {
    return next(new customeError("User not found with this email", 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${config.Dashboard_FRONTEND_URL}/password/reset/${resetToken}`;
  const gmailMessageFormat = `Your reset password Url is as follows : \n\n ${resetPasswordUrl} \n\n Thank you `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Dashboard Password Recovery Mail ",
      message: gmailMessageFormat,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    console.log(error);
    user.resetpasswordToken = undefined;
    user.resetpasswordExpire = undefined;
    await user.save();
    return next(new customeError(error.message, 500));
  }
});
export {
  postCreateUser,
  postLogin,
  doLogout,
  getUser,
  updateProfile,
  updatePassword,
  getUserForPortfolio,
  resetPassword,
};
