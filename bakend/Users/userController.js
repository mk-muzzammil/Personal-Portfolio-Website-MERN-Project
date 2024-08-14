import catchAsyncErrors from "../src/middlewares/catchAsyncErrors";
const postCreateUser = catchAsyncErrors(async (req, res, next) => {
  console.log("User created");
  res.status(201).json({
    success: true,
    message: "User created successfully",
  });
});

export { postCreateUser };
