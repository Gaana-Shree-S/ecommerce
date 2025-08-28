import type { Request, Response } from "express";
import Cart from "../models/Cart";
import Order from "../models/Order";
import Product from "../models/Product";

export const placeOrder = async (req: Request & { user?: any }, res: Response) => {
  try {
    const cartItems = await Cart.find({ userId: req.user!.userId }).populate("productId");

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const products = cartItems.map((item: any) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));

    const totalPrice = cartItems.reduce(
      (sum: number, item: any) => sum + item.productId.price * item.quantity,
      0
    );

    const order = await Order.create({
      userId: req.user!.userId,
      products,
      totalPrice,
    });

    await Cart.deleteMany({ userId: req.user!.userId });

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", err });
  }
};

export const getMyOrders = async (req: Request & { user?: any }, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user!.userId }).populate("products.productId");
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", err });
  }
};


export const getOrderById = async (req: Request & { user?: any }, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user!.userId }).populate(
      "products.productId"
    );
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", err });
  }
};
