import express from "express";
import * as productController from "../controllers/productController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

router.get("/", productController.list);
router.get("/:id", productController.getOne);

router.post("/", requireAuth, requireRole("admin"), productController.create);
router.put("/:id", requireAuth, requireRole("admin"), productController.update);
router.delete("/:id", requireAuth, requireRole("admin"), productController.remove);

export default router;
