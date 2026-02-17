import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { products } from "../data/productSeed.js";

async function seed() {
  await connectDb(process.env.MONGODB_URI);

  let adminUser = await User.findOne({ email: "admin@leafinity.com" });
  if (!adminUser) {
    adminUser = await User.create({
      name: "Admin",
      email: "admin@leafinity.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    });
    console.log("Created admin user: admin@leafinity.com / admin123");
  } else if (adminUser.role !== "admin") {
    // ensure existing account has admin role
    adminUser.role = "admin";
    await adminUser.save();
    console.log("Updated existing user to admin role");
  }

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(products);
    console.log("Seeded", products.length, "products");
  } else {
    console.log("Products already exist, skipping product seed");
  }

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
