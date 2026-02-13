import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rooftopSizeSqFt: { type: Number, required: true, min: 1 },
    systemType: {
      type: String,
      enum: ["soil", "hydro"],
      required: true
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    estimatedPriceINR: { type: Number, required: true },
    media: {
      video: String, // Cloudinary URL (1 video max)
      images: [String] // Cloudinary URLs (max 3)
    },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "designing",
        "installation",
        "maintenance",
        "completed",
        "rejected"
      ],
      default: "pending"
    },
    siteVisitDate: Date,
    assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: String,
    maintenanceSchedule: [
      {
        date: Date,
        completed: { type: Boolean, default: false },
        notes: String,
        staffAssigned: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
      }
    ]
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

export const Booking = mongoose.model("Booking", bookingSchema);
