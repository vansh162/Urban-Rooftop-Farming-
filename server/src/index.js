import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import app from "./app.js";
import { connectDb } from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start server
try {
  await connectDb(process.env.MONGODB_URI);
  
  const server = createServer(app);
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Leafinity API running on http://localhost:${PORT}`);
  });

  // Handle server errors
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      // eslint-disable-next-line no-console
      console.error(`❌ Port ${PORT} is already in use.`);
      // eslint-disable-next-line no-console
      console.error(`💡 Kill the process using: netstat -ano | findstr :${PORT}`);
      // eslint-disable-next-line no-console
      console.error(`💡 Or change PORT in .env file`);
      process.exit(1);
    } else {
      // eslint-disable-next-line no-console
      console.error("Server error:", err);
      process.exit(1);
    }
  });
} catch (err) {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", err);
  process.exit(1);
}
