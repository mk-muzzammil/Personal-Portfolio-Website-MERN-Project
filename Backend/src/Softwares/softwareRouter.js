import express from "express";
import tokenVerification from "../middlewares/tokenVerification.js";
import {
  getAllSoftwares,
  postAddSoftware,
  deleteSoftware,
} from "./softwareController.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const softwareRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadMulter = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});
softwareRouter.get("/getAllSoftwares", getAllSoftwares);
softwareRouter.post(
  "/createSoftware",
  tokenVerification,
  uploadMulter.single("image"),
  postAddSoftware
);
softwareRouter.delete("/:softwareId", tokenVerification, deleteSoftware);

export default softwareRouter;
