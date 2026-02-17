import { Booking } from "../models/Booking.js";
import { estimateBookingPriceINR } from "../utils/priceEstimator.js";

export const estimate = (req, res) => {
  const { rooftopSizeSqFt, systemType } = req.body || {};
  const result = estimateBookingPriceINR({ rooftopSizeSqFt, systemType });
  res.json(result);
};

export const create = async (req, res) => {
  try {
    const { rooftopSizeSqFt, systemType, location, media } = req.body;
    if (!rooftopSizeSqFt || !systemType || !location?.address || !location?.city || !location?.state || !location?.pincode) {
      return res.status(400).json({ error: "Rooftop size, system type and full location are required" });
    }
    const estimateResult = estimateBookingPriceINR({ rooftopSizeSqFt, systemType });
    if (!estimateResult.success) {
      return res.status(400).json({ error: estimateResult.error });
    }
    // Validate media: 1 video and/or up to 3 images
    if (media) {
      if (media.images && media.images.length > 3) {
        return res.status(400).json({ error: "Maximum 3 images allowed." });
      }
      if (media.video && typeof media.video === "string" && media.video.length === 0) {
        delete media.video;
      }
    }
    const booking = new Booking({
      user: req.user.id,
      rooftopSizeSqFt,
      systemType,
      location,
      estimatedPriceINR: estimateResult.estimatedPriceINR,
      media: media || {},
    });
    await booking.save();
    const populated = await booking.populate({ path: "user", select: "id name email" });
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const myBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("assignedStaff", "id name");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const adminList = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "id name email phone")
      .populate("assignedStaff", "id name");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const adminGetOne = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "id name email phone address")
      .populate("assignedStaff", "id name")
      .populate("maintenanceSchedule.staffAssigned", "id name");
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const adminUpdate = async (req, res) => {
  try {
    const { status, siteVisitDate, assignedStaffId, notes, maintenanceSchedule: newSchedule } = req.body;
    const update = {};
    if (status !== undefined) update.status = status;
    if (siteVisitDate !== undefined) update.siteVisitDate = siteVisitDate;
    if (assignedStaffId !== undefined) update.assignedStaff = assignedStaffId;
    if (notes !== undefined) update.notes = notes;
    if (newSchedule !== undefined) update.maintenanceSchedule = newSchedule;

    const booking = await Booking.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate("user", "id name email")
      .populate("assignedStaff", "id name")
      .populate("maintenanceSchedule.staffAssigned", "id name");
    
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};