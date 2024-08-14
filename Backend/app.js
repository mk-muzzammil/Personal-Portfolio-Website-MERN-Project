import express from "express";
const app = express();

app.use("/", () => {
  console.log("Hello World");
});
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

export default app;
