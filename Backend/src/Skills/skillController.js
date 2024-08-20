import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import customeError from "../middlewares/globalErrorHandler.js";
import Skill from "./skillModel.js";
import fs from "fs";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUploads.js";

export const getAllSkills = catchAsyncErrors(async (req, res, next) => {
  const skillsData = await Skill.find();
  if (!skillsData) {
    return next(new customeError("No Skills Found", 404));
  }
  res.status(200).json({
    message: "All Skills Extracted",
    error: false,
    data: skillsData,
  });
});
export const getSkillById = catchAsyncErrors(async (req, res, next) => {
  const { skillId } = req.params;
  if (!skillId) {
    return next(new customeError("Skill Id required", 404));
  }
  const skillData = await Skill.find({ _id: skillId });
  if (!skillData) {
    return next(new customeError("No Skill Found", 404));
  }
  res.status(200).json({
    message: "Skill Extracted",
    error: false,
    data: skillData,
  });
});
export const postAddSkill = catchAsyncErrors(async (req, res, next) => {
  const { svgIcon } = req.files;
  const { title, proficiency } = req.body;
  console.log("Image", svgIcon);
  if (!svgIcon || !title || !proficiency) {
    return next(
      new customeError("Please provide all the required fields", 400)
    );
  }
  const svgUploadCloudinaryresult = await uploadToCloudinary(
    svgIcon[0].path,
    "Skills",
    "image",
    svgIcon[0].mimetype.split("/")[1]
  );
  if (!svgUploadCloudinaryresult || svgUploadCloudinaryresult.error) {
    return next(new customeError("Error in uploading image", 500));
  }
  const public_id = svgUploadCloudinaryresult.public_id;
  const url = svgUploadCloudinaryresult.secure_url;

  const newSkill = await Skill.create({
    title,
    proficiency,
    svgIcon: { public_id, url },
  });
  fs.unlinkSync(svgIcon[0].path);
  res.status(201).json({
    error: false,
    message: "Skill Created",
    data: newSkill._id,
  });
});
export const putUpdateSkill = catchAsyncErrors(async (req, res, next) => {
  const { skillId } = req.params;
  const skill = await Skill.findById(skillId);
  if (!skill) {
    return next(new customeError("Skill not found", 404));
  }
  const { title, proficiency } = req.body;
  const { svgIcon } = req.files;

  let oldTitle = skill.title;
  let oldProficiency = skill.proficiency;
  let oldImage = skill.svgIcon;
  if (svgIcon || req.files || title || proficiency) {
    if (svgIcon) {
      await deleteFromCloudinary(oldImage.public_id, "image");
      const svgUploadCloudinaryresult = await uploadToCloudinary(
        svgIcon[0].path,
        "Skills",
        "image",
        svgIcon[0].mimetype.split("/")[1]
      );
      if (!svgUploadCloudinaryresult || svgUploadCloudinaryresult.error) {
        return next(new customeError("Error in uploading image", 500));
      }
      const public_id = svgUploadCloudinaryresult.public_id;
      const secure_url = svgUploadCloudinaryresult.secure_url;
      oldImage.public_id = public_id;
      oldImage.url = secure_url;

      fs.unlinkSync(svgIcon[0].path);
    }
    if (title) {
      oldTitle = title;
    }
    if (proficiency) {
      oldProficiency = proficiency;
    }
  }
  const updatedSkill = await Skill.findByIdAndUpdate(
    skillId,
    { title: oldTitle, proficiency: oldProficiency, svgIcon: oldImage },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    error: false,
    message: "Skill updated Succesfully",
    data: updatedSkill,
  });
});
export const deleteSkill = catchAsyncErrors(async (req, res, next) => {
  const { skillId } = req.params;
  if (!skillId) {
    return next(new customeError("Id required to delete", 404));
  }
  const skill = await Skill.findById(skillId);
  if (!skill) {
    return next(new customeError("Skill not found", 404));
  }
  const public_id = skill.svgIcon.public_id;
  await deleteFromCloudinary(public_id, "image");
  const deletionresult = await Skill.deleteOne({ _id: skillId });
  if (!deletionresult) {
    return next(new customeError("Error deleting skill", 500));
  }
  res.status(200).json({
    error: false,
    message: "Skill deleted Succesfully",
  });
});
