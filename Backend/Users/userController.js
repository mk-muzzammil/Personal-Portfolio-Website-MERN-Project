import catchAsyncErrors from "../src/middlewares/catchAsyncErrors";
import customeError from "../src/middlewares/globalErrorHandler";
import User from "./userModel";
const postCreateUser = catchAsyncErrors(async (req, res, next) => {
  if(!req.files && Object.keys(req.files).length === 0) {



  });

export { postCreateUser };
