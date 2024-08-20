import Project from "./projectModel.js";
import customeError from "../middlewares/globalErrorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import fs from "fs";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUploads.js";
import { error } from "console";

export const getAllProjects = catchAsyncErrors(async (req, res, next) => {
  const projectdata = await Project.find();
  if (Object.keys(projectdata).length === 0) {
    return next(new customeError("No Projects Found", 404));
  }
  res.status(200).json({
    message: "All Projects Extracted",
    error: false,
    data: projectdata,
  });
});
export const getProjectById = catchAsyncErrors(async (req, res, next) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    return next(new customeError("Project not found", 404));
  }
  res.status(200).json({
    message: "Project Extracted",
    error: false,
    data: project,
  });
});
export const postAddProject = catchAsyncErrors(async (req, res, next) => {
  if (!req.files.projectBanner) {
    return next(new customeError("Please provide The project banner", 400));
  }
  const { projectBanner } = req.files;
  const {
    title,
    description,
    technologies,
    projectLink,
    githubLink,
    stack,
    deployed,
  } = req.body;
  if (
    !title ||
    !description ||
    !technologies ||
    !projectLink ||
    !githubLink ||
    !stack ||
    !deployed
  ) {
    return next(
      new customeError("Please provide all the required fields", 400)
    );
  }
  const projectBannerUploadCloudinaryResult = await uploadToCloudinary(
    projectBanner[0].path,
    "Projects",
    "image",
    projectBanner[0].mimetype.split("/")[1]
  );
  if (
    !projectBannerUploadCloudinaryResult ||
    projectBannerUploadCloudinaryResult.error
  ) {
    return next(new customeError("Error in uploading image", 500));
  }
  const public_id = projectBannerUploadCloudinaryResult.public_id;
  const url = projectBannerUploadCloudinaryResult.secure_url;
  const newProject = await Project.create({
    title,
    description,
    projectBanner: { public_id, url },
    technologies: technologies.split(","),
    projectLink,
    githubLink,
    stack,
    deployed,
  });
  fs.unlink(projectBanner[0].path, (error) => {
    if (error) {
      console.log(error);
    }
    console.log("File Deleted");
  });
  res.status(201).json({
    error: false,
    message: "Project Created",
    data: newProject._id,
  });
});
export const putUpdateProject = catchAsyncErrors(async (req, res, next) => {
  const { projectId } = req.params;
  if (!projectId) {
    return next(new customeError("Project ID required", 404));
  }
  const project = await Project.findById(projectId);
  if (!project) {
    return next(new customeError("Project not found", 404));
  }
  const { projectBanner } = req.files;
  const {
    title,
    description,
    technologies,
    projectLink,
    githubLink,
    stack,
    deployed,
  } = req.body;

  let bannerImage = project.projectBanner;
  if (projectBanner) {
    await deleteFromCloudinary(bannerImage.public_id, "image");
    const projectBannerUploadCloudinaryResult = await uploadToCloudinary(
      projectBanner[0].path,
      "Projects",
      "image",
      projectBanner[0].mimetype.split("/")[1]
    );
    if (
      !projectBannerUploadCloudinaryResult ||
      projectBannerUploadCloudinaryResult.error
    ) {
      return next(new customeError("Error in uploading image", 500));
    }
    const public_id = projectBannerUploadCloudinaryResult.public_id;
    const url = projectBannerUploadCloudinaryResult.secure_url;
    bannerImage.public_id = public_id;
    bannerImage.url = url;

    fs.unlink(projectBanner[0].path, (error) => {
      if (error) {
        console.log(error);
      }
      console.log("File Deleted");
    });
  }
  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    {
      title,
      description,
      projectBanner: bannerImage,
      technologies: technologies.split(","),
      projectLink,
      githubLink,
      stack,
      deployed,
    },
    { new: true, runValidators: true, useFindAndModify: false }
  );

  res.status(200).json({
    error: false,
    message: "Project Updated",
    data: updatedProject,
  });
});
export const deleteProject = catchAsyncErrors(async (req, res, next) => {
  const { projectId } = req.params;
  if (!projectId) {
    return next(new customeError("Project ID required", 404));
  }
  const project = await Project.findById(projectId);
  if (!project) {
    return next(new customeError("Project not found", 404));
  }
  const projectBannerPublicId = project.projectBanner.public_id;
  await deleteFromCloudinary(projectBannerPublicId, "image");
  const deletionResult = await Project.deleteOne({ _id: projectId });
  if (!deletionResult) {
    return next(new customeError("Project not deleted", 500));
  }
  res.status(200).json({
    error: false,
    message: "Project Deleted",
  });
});
