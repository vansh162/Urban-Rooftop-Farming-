import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: Number
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
