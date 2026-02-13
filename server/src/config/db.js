import mongoose from "mongoose";

let isConnected = false;

export const connectDb = async (uri, retryCount = 0) => {
  const maxRetries = 5;
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    });
    isConnected = true;
    // eslint-disable-next-line no-console
    console.log("✅ MongoDB connected successfully");
    return true;
  } catch (err) {
    if (retryCount >= maxRetries) {
      // eslint-disable-next-line no-console
      console.error("❌ MongoDB connection failed after", maxRetries, "retries");
      // eslint-disable-next-line no-console
      console.error("💡 Troubleshooting tips:");
      // eslint-disable-next-line no-console
      console.error("   1. Check your internet connection");
      // eslint-disable-next-line no-console
      console.error("   2. Verify MongoDB Atlas IP whitelist (0.0.0.0/0 for all IPs)");
      // eslint-disable-next-line no-console
      console.error("   3. Check firewall/antivirus settings");
      // eslint-disable-next-line no-console
      console.error("   4. Try using local MongoDB: mongodb://127.0.0.1:27017/leafinity");
      throw err; // Re-throw to prevent server from starting
    }
    
    // eslint-disable-next-line no-console
    console.error(`❌ MongoDB connection error (attempt ${retryCount + 1}/${maxRetries}):`, err.message);
    // eslint-disable-next-line no-console
    console.error("⏳ Retrying in 5 seconds...\n");
    
    // Wait 5 seconds then retry
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return connectDb(uri, retryCount + 1);
  }
};
