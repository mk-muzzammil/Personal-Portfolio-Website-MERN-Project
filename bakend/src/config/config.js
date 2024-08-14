import { config as conf } from "dotenv";
conf();

const _config = {
  PORT: process.env.PORT,
  PORTFOLIO_FRONTEND_URL: process.env.PORTFOLIO_FRONTEND_URL,
  Dashboard_FRONTEND_URL: process.env.Dashboard_FRONTEND_URL,
  MONGO_URI: process.env.MONGO_URI,
  DB_NAME: process.env.DB_NAME,
};
export const config = Object.freeze(_config);
