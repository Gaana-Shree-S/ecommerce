import type { Request, Response } from "express";
import Product from "../models/Product";


export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category } = req.query;
    let query: any = {};

    if (search) {
      query.name = { $regex: search as string, $options: "i" };
    }
    if (category && category !== "All") {
      query.category = category;
    }

    const products = await Product.find(query);
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
