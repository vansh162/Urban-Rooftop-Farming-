// Vercel API route handler for all /api/* requests
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { connectDb, mongoose } from "../src/config/db.js";
import app from "../src/app.js";

let db_connected = false;

// Connection pool for serverless - keep connection alive across invocations
async function ensureDbConnected() {
  if (mongoose.connection.readyState === 1) {
    // Already connected
    return;
  }
  
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }
  
  await connectDb(process.env.MONGODB_URI);
}

export default async function handler(req, res) {
  try {
    // Ensure database is connected before handling request
    await ensureDbConnected();
    
    // Properly invoke Express app as middleware
    return new Promise((resolve, reject) => {
      app(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
}
