import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

export const create = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items?.length || !shippingAddress?.address || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.pincode) {
      return res.status(400).json({ error: "Items and full shipping address are required" });
    }
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(400).json({ error: `Product ${item.productId} not found` });
      if (product.stock < (item.quantity || 1)) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
      const qty = item.quantity || 1;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
      });
      subtotal += product.price * qty;
    }
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      subtotal,
      shippingAddress,
    });
    // Optional: decrement stock (can be done in a job or on payment confirmation)
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }
    const populated = await Order.findById(order._id).populate("user", "name email");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const adminList = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate("user", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const adminGet = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const adminUpdate = async (req, res) => {
  try {
    const { status } = req.body;
    if (status && !Order.schema.path('status').enumValues.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate("user", "name email");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

