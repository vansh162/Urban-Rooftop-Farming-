// Vercel API route handler for all /api/* requests
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import app from "../src/app.js";

export default function handler(req, res) {
  // Forward request to Express app
  return app(req, res);
}
