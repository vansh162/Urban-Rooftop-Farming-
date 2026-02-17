import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const isConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);
if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const uploadImage = async (req, res) => {
  const { image } = req.body; // base64 data URL or external URL
  if (!image) return res.status(400).json({ error: "Image data required" });

  // If Cloudinary configured, use it
  if (isConfigured) {
    try {
      const result = await cloudinary.uploader.upload(image, {
        folder: "leafinity/rooftops",
        resource_type: "image",
      });
      return res.json({ url: result.secure_url, publicId: result.public_id });
    } catch (err) {
      return res.status(500).json({ error: err.message || "Upload failed" });
    }
  }

  // Fallback: save base64 image locally to /public/uploads
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const uploadsDir = path.join(__dirname, "..", "..", "public", "uploads", "images");
    await fs.promises.mkdir(uploadsDir, { recursive: true });

    // data:image/png;base64,....
    const matches = image.match(/^data:(image\/[^;]+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ error: "Invalid image data" });
    const ext = matches[1].split("/")[1] || "png";
    const buffer = Buffer.from(matches[2], "base64");
    const filename = `img_${Date.now()}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filepath, buffer);
    const url = `${req.protocol}://${req.get("host")}/uploads/images/${filename}`;
    return res.json({ url, local: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Local save failed" });
  }
};

export const uploadVideo = async (req, res) => {
  const { video } = req.body; // base64 or URL
  if (!video) return res.status(400).json({ error: "Video data required" });

  if (isConfigured) {
    try {
      const result = await cloudinary.uploader.upload(video, {
        folder: "leafinity/rooftops",
        resource_type: "video",
      });
      return res.json({ url: result.secure_url, publicId: result.public_id });
    } catch (err) {
      return res.status(500).json({ error: err.message || "Upload failed" });
    }
  }

  // Fallback: save base64 video locally
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const uploadsDir = path.join(__dirname, "..", "..", "public", "uploads", "videos");
    await fs.promises.mkdir(uploadsDir, { recursive: true });

    const matches = video.match(/^data:(video\/[^;]+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ error: "Invalid video data" });
    const ext = matches[1].split("/")[1] || "mp4";
    const buffer = Buffer.from(matches[2], "base64");
    const filename = `vid_${Date.now()}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filepath, buffer);
    const url = `${req.protocol}://${req.get("host")}/uploads/videos/${filename}`;
    return res.json({ url, local: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Local save failed" });
  }
};
