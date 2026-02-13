import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { uploadImage, uploadVideo } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/image", requireAuth, uploadImage);
router.post("/video", requireAuth, uploadVideo);

export default router;
