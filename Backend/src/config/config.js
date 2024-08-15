import { config as conf } from "dotenv";
conf();

const _config = {
  PORT: process.env.PORT,
  PORTFOLIO_FRONTEND_URL: process.env.PORTFOLIO_FRONTEND_URL,
  Dashboard_FRONTEND_URL: process.env.Dashboard_FRONTEND_URL,
  MONGO_URI: process.env.MONGO_URI,
  Cloudinary_Cloud_Name: process.env.Cloudinary_Cloud_Name,
  Cloudinary_api_key: process.env.Cloudinary_api_key,
  Cloudinary_api_secret: process.env.Cloudinary_api_secret,
  DB_NAME: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_TIME: process.env.JWT_EXPIRES_TIME,
  JWT_COOKIE_EXPIRES_TIME: process.env.JWT_COOKIE_EXPIRES_TIME,
};
export const config = Object.freeze(_config);
