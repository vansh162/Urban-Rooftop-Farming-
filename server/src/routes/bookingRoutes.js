import express from "express";
import * as bookingController from "../controllers/bookingController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

router.post("/estimate", bookingController.estimate);

router.post("/", requireAuth, bookingController.create);
router.get("/my", requireAuth, bookingController.myBookings);

router.get("/admin", requireAuth, requireRole("admin"), bookingController.adminList);
router.get("/admin/:id", requireAuth, requireRole("admin"), bookingController.adminGetOne);
router.patch("/admin/:id", requireAuth, requireRole("admin"), bookingController.adminUpdate);

export default router;
