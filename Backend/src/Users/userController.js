import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import customeError from "../middlewares/globalErrorHandler.js";
import User from "./userModel.js";
const postCreateUser = catchAsyncErrors(async (req, res, next) => {
  if (!req.files && Object.keys(req.files).length === 0) {
    return next(new customeError("Avatr and Resume is required", 400));
  }
  const { avatar, resume } = req.files;
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

  console.log("All Things", req.body);
});

export { postCreateUser };
