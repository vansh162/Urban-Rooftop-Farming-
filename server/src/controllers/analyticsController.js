import { Order } from "../models/Order.js";
import { Booking } from "../models/Booking.js";
import { Product } from "../models/Product.js";

export const overview = async (req, res) => {
  try {
    const [orderStats, bookingStats, lowStockCount] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $nin: ["cancelled"] } } },
        { $group: { _id: null, totalSales: { $sum: "$subtotal" }, count: { $sum: 1 } } },
      ]).then((r) => r[0] || { totalSales: 0, count: 0 }),
      Booking.countDocuments({ status: "pending" }),
      Product.countDocuments({ $expr: { $lte: ["$stock", 10] } }),
    ]);

    const revenue = orderStats.totalSales || 0;
    const totalOrders = orderStats.count || 0;

    res.json({
      totalSales: revenue,
      totalOrders,
      newBookings: bookingStats,
      lowStockItems: lowStockCount,
      revenue,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
