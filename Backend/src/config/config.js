import { config as conf } from "dotenv";
import { process } from "node";
conf();

const _config = {
  PORT: process.env.PORT,
  PORTFOLIO_FRONTEND_URL: process.env.PORTFOLIO_FRONTEND_URL,
  Dashboard_FRONTEND_URL: process.env.Dashboard_FRONTEND_URL,
  MONGO_URI: process.env.MONGO_URI,
};
console.log(process.env.PORT);
export const config = Object.freeze(_config);
