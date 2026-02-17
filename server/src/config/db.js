import mongoose from "mongoose";

export const connectDb = async (uri) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // eslint-disable-next-line no-console
    console.log("✅ MongoDB connected successfully");
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("❌ Database connection error:", err.message);
    throw err;
  }
};

export { mongoose };
