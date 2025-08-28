import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  inStock: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
