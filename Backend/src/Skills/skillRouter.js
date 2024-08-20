import express from "express";
import tokenVerification from "../middlewares/tokenVerification.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  getAllSkills,
  postAddSkill,
  putUpdateSkill,
  deleteSkill,
  getSkillById,
} from "./skillController.js";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const uploadMulter = multer({
  dest: path.resolve(_dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});
const skillRouter = express.Router();

skillRouter.get("/getAllSkills", getAllSkills);
skillRouter.get("/:skillId", tokenVerification, getSkillById);
skillRouter.post(
  "/addSkill",
  tokenVerification,
  uploadMulter.fields([{ name: "svgIcon", maxCount: 1 }]),
  postAddSkill
);
skillRouter.put(
  "/:skillId",
  tokenVerification,
  uploadMulter.fields([{ name: "svgIcon", maxCount: 1 }]),
  putUpdateSkill
);
skillRouter.delete("/:skillId", tokenVerification, deleteSkill);

export default skillRouter;
