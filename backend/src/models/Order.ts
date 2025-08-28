import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrder extends Document {
  userId: Types.ObjectId;
  products: { productId: string; quantity: number }[];
  totalPrice: number;
  status: "Pending" | "Shipped" | "Delivered";
  orderDate: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Shipped", "Delivered"], default: "Pending" },
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);
