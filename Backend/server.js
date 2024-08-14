import app from "./src/app.js";
import { config } from "./src/config/config.js";

const StartServer = () => {
  app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
};

StartServer();
