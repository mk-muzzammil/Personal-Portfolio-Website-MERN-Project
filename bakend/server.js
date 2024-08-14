import app from "./src/app.js";
import { config } from "./src/config/config.js";
import dbconnection from "./src/config/databaseConnection.js";

const startServer = () => {
  const PORT = config.PORT | 8080;
  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await dbconnection();
  });
};

startServer();
