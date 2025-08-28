import type { Request, Response } from "express";
import Cart from "../models/Cart";

export const getCart = async (req: Request & { user?: any }, res: Response) => {
  try {
    const items = await Cart.find({ userId: req.user!.userId }).populate("productId");
    res.json({ success: true, count: items.length, items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", err });
  }
};

export const addToCart = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    let cartItem = await Cart.findOne({ userId: req.user!.userId, productId });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ userId: req.user!.userId, productId, quantity });
    }

    res.status(201).json({ success: true, item: cartItem });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", err });
  }
};

export const updateCartItem = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { quantity } = req.body;
    const item = await Cart.findOneAndUpdate(
      { _id: req.params.itemId, userId: req.user!.userId },
      { quantity },
      { new: true }
    );
    if (!item) return res.status(404).json({ success: false, message: "Cart item not found" });

    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", err });
  }
};

export const removeCartItem = async (req: Request & { user?: any }, res: Response) => {
  try {
    await Cart.findOneAndDelete({ _id: req.params.itemId, userId: req.user!.userId });
    res.json({ success: true, message: "Item removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", err });
  }
};


export const clearCart = async (req: Request & { user?: any }, res: Response) => {
  try {
    await Cart.deleteMany({ userId: req.user!.userId });
    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", err });
  }
};
