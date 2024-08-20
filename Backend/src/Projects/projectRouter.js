import express from "express";
import tokenVerification from "../middlewares/tokenVerification.js";
import {
  getAllProjects,
  postAddProject,
  putUpdateProject,
  deleteProject,
  getProjectById,
} from "./projectController.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const projectRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadMulter = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});

projectRouter.get("/getAllProjects", getAllProjects);
projectRouter.get("/:projectId", tokenVerification, getProjectById);
projectRouter.post(
  "/addProject",
  tokenVerification,
  uploadMulter.fields([{ name: "projectBanner", maxCount: 1 }]),
  postAddProject
);
projectRouter.put(
  "/:projectId",
  tokenVerification,
  uploadMulter.fields([{ name: "projectBanner", maxCount: 1 }]),
  putUpdateProject
);
projectRouter.delete("/:projectId", tokenVerification, deleteProject);

export default projectRouter;
