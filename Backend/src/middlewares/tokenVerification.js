import jwt from "jsonwebtoken";
import customeError from "./globalErrorHandler.js";
import { config } from "../config/config.js";

const tokenVerification = async (req, res, next) => {
  let token = req.cookies.token;
  if (!token) {
    return next(new customeError("Please login to access this resource", 401));
  }
  try {
    const decodedToken = await jwt.verify(token, config.JWT_SECRET);
    if (!decodedToken) {
      return next(new customeError("JWT Token required ", 401));
    }
    req.user = decodedToken;
    console.log(decodedToken, "OK");

    next();
  } catch (error) {
    return next(new customeError("Invalid token or expired", 401));
  }
};

export default tokenVerification;
