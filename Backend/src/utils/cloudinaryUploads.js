import cloudinary from "../config/cloudinaryConfig.js";
import customeError from "../middlewares/globalErrorHandler.js";
export const uploadToCloudinary = async (
  filePath,
  folderName,
  resourceType,
  fileFormat
) => {
  try {
    return await cloudinary.uploader.upload(filePath, {
      folder: folderName,
      resource_type: resourceType,
      format: fileFormat,
    });
  } catch (error) {
    throw new customeError(
      `Error uploading to Cloudinary: ${error.message}`,
      500
    );
  }
};

// Utility function for Cloudinary deletion
export const deleteFromCloudinary = async (publicId, resourceType) => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    throw new customeError(
      `Error deleting from Cloudinary: ${error.message}`,
      500
    );
  }
};
