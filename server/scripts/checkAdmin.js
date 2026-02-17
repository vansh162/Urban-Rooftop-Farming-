import dotenv from "dotenv";
dotenv.config();
import { connectDb } from "../src/config/db.js";
import { User } from "../src/models/User.js";

(async () => {
  await connectDb(process.env.MONGODB_URI);
  const u = await User.findOne({ email: "admin@leafinity.com" }).lean();
  console.log(u);
  process.exit(0);
})();
