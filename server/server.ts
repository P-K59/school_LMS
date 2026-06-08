require("dotenv").config();
import { app } from "./src/app";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
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