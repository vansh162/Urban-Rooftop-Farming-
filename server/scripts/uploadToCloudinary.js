import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Load server .env
dotenv.config({ path: path.resolve(process.cwd(), "server", ".env") });

const isConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);
if (!isConfigured) {
  console.error("Cloudinary not configured in server/.env. Set CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET.");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error("Usage: node uploadToCloudinary.js <filePath> [image|video|auto]");
    process.exit(1);
  }
  const filePath = path.resolve(process.cwd(), args[0]);
  if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath);
    process.exit(1);
  }
  const explicitType = args[1] ? args[1].toLowerCase() : "auto";
  const ext = path.extname(filePath).toLowerCase();
  const imageExts = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg"];
  const videoExts = [".mp4", ".mov", ".webm", ".ogg", ".mkv"];
  let resource_type = "auto";
  if (explicitType === "image" || (explicitType === "auto" && imageExts.includes(ext))) resource_type = "image";
  if (explicitType === "video" || (explicitType === "auto" && videoExts.includes(ext))) resource_type = "video";

  try {
    console.log("Uploading", filePath, "as", resource_type);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "leafinity/rooftops",
      resource_type,
    });
    console.log("Upload successful:", JSON.stringify({ provider: "cloudinary", url: result.secure_url, publicId: result.public_id }, null, 2));
  } catch (err) {
    console.error("Upload failed:", err.message || err);
    process.exitCode = 2;
  }
}

main();
