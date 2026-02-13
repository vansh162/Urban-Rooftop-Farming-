import { v2 as cloudinary } from "cloudinary";

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
  if (!isConfigured) return res.status(503).json({ error: "Cloudinary not configured" });
  try {
    const { image } = req.body; // base64 data URL
    if (!image) return res.status(400).json({ error: "Image data required" });
    const result = await cloudinary.uploader.upload(image, {
      folder: "leafinity/rooftops",
      resource_type: "image",
    });
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    res.status(500).json({ error: err.message || "Upload failed" });
  }
};

export const uploadVideo = async (req, res) => {
  if (!isConfigured) return res.status(503).json({ error: "Cloudinary not configured" });
  try {
    const { video } = req.body; // base64 or URL
    if (!video) return res.status(400).json({ error: "Video data required" });
    const result = await cloudinary.uploader.upload(video, {
      folder: "leafinity/rooftops",
      resource_type: "video",
    });
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    res.status(500).json({ error: err.message || "Upload failed" });
  }
};
