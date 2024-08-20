import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import customeError from "../middlewares/globalErrorHandler.js";
import Software from "./softwareModel.js";
import fs from "fs";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUploads.js";

const getAllSoftwares = catchAsyncErrors(async (req, res, next) => {
  const softwaresData = await Software.find();
  if (Object.keys(softwaresData).length === 0) {
    return next(new customeError("No Softwares Found", 404));
  }
  res.status(200).json({
    message: "All Softwares Extracted",
    error: false,
    data: softwaresData,
  });
});
const postAddSoftware = catchAsyncErrors(async (req, res, next) => {
  const image = req.file;
  const { name } = req.body;
  console.log("Image", image);

  const softwareUploadResult = await uploadToCloudinary(
    image.path,
    "Softwares",
    "image",
    image.mimetype.split("/")[1]
  );
  if (!softwareUploadResult || softwareUploadResult.error) {
    return next(new customeError("Error in uploading image", 500));
  }
  const public_id = softwareUploadResult.public_id;
  const url = softwareUploadResult.secure_url;
  const newSoftware = await Software.create({
    name,
    image: { public_id, url },
  });
  fs.unlinkSync(image.path);
  res.status(201).json({
    error: false,
    message: "Software Created",
    data: newSoftware._id,
  });
});
const deleteSoftware = catchAsyncErrors(async (req, res, next) => {
  const { softwareId } = req.params;
  if (!softwareId) {
    return next(new customeError("Software not found", 404));
  }
  const software = await Software.findById(softwareId);
  if (!software) {
    return next(new customeError("Software not found", 404));
  }
  const public_id = software.image.public_id;
  await deleteFromCloudinary(public_id, "image");
  const deletionresult = await Software.deleteOne({ _id: softwareId });
  if (!deletionresult) {
    return next(new customeError("Software not deleted", 500));
  }
  res.status(200).json({
    error: false,
    message: "Software Deleted",
  });
});
export { postAddSoftware, getAllSoftwares, deleteSoftware };
