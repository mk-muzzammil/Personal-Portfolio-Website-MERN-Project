import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import customeError from "../middlewares/globalErrorHandler";
import Timeline from "./timelineModel.js";

const getAllTimelines = catchAsyncErrors(async (req, res, next) => {
  const TimeLines = await Timeline.find();
  if (Object.keys(TimeLines).length === 0) {
    return res.status(200).json({
      message: "No Timelines Found",
      error: false,
      data: TimeLines,
    });
  }

  res.status(200).json({
    message: "All timelines Extracted",
    error: false,
    data: TimeLines,
  });
});
const postAddTimeline = catchAsyncErrors(async (req, res, next) => {
  const { title, description, from, to } = req.body;
  const newTimeline = await Timeline.create({
    title,
    description,
    Timeline: { from, to },
  });

  if (!newTimeline) {
    return next(new customeError("Timeline not created", 400));
  }
  res.status(201).json({
    error: false,
    message: "Timeline Created",
    data: newTimeline,
  });
});

export { getAllTimelines, postAddTimeline };
