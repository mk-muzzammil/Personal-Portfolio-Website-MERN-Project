import { config } from "../config/config.js";

const postSignUp = (req, res, next) => {
  res.send("Signup page");
};
const postLogin = (req, res, next) => {
  res.send("Login page");
};

export { postSignUp, postLogin };
