import express from "express";
import tokenVerification from "../middlewares/tokenVerification.js";
import {
  getAllTimelines,
  postAddTimeline,
  deleteTimeline,
} from "./timelineController.js";

const timelineRouter = express.Router();

timelineRouter.get("/getAllTimelines", getAllTimelines);
timelineRouter.post("/createTimeline", tokenVerification, postAddTimeline);
timelineRouter.delete("/:timelineId", tokenVerification, deleteTimeline);

export default timelineRouter;
