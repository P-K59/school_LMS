require("dotenv").config();
import { app } from "./src/app";
import { env } from "./src/config/env";

const PORT = env.Port;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();

process.on("SIGTERM", async () => {
  console.log("SIGTERM received");
  process.exit(0);
});