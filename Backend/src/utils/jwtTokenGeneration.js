import { config } from "../config/config.js";
import jwt from "jsonwebtoken";
import customeError from "../middlewares/globalErrorHandler.js";
const jwtTokenGeneration = async (user, message, statusCode, res, next) => {
  const token = await jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_TIME,
  });
  if (!token) {
    return next(new customeError("Token generation failed", 500));
  }
  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + config.JWT_COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      message: message,
      token: token,
    });
};
export default jwtTokenGeneration;
