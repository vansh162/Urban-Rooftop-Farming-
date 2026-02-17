import express from "express";
import * as orderController from "../controllers/orderController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

router.post("/", requireAuth, orderController.create);
router.get("/my", requireAuth, orderController.myOrders);

router.get("/admin", requireAuth, requireRole("admin"), orderController.adminList);
router.get("/admin/:id", requireAuth, requireRole("admin"), orderController.adminGet);
router.patch("/admin/:id", requireAuth, requireRole("admin"), orderController.adminUpdate);

export default router;
