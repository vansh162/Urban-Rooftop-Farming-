import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.[process.env.COOKIE_NAME || "leafinity_token"];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId)
      .select("_id name email role phone address createdAt updatedAt")
      .lean();
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // lean() doesn’t include the id virtual, so add it manually
    req.user = { ...user, id: user._id?.toString() };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
