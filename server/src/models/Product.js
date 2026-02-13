import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "containers",
        "growing-media",
        "irrigation-tech",
        "vertical-gardening",
        "pest-management",
        "monitoring-tools"
      ],
      required: true
    },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: [{ type: String }], // Cloudinary URLs
    sku: { type: String, unique: true, sparse: true },
    specifications: {
      weight: String,
      dimensions: String,
      material: String,
      capacity: String
    },
    featured: { type: Boolean, default: false },
    tags: [String]
  },
  { timestamps: true }
);

// Index for search/filtering
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });

export const Product = mongoose.model("Product", productSchema);
