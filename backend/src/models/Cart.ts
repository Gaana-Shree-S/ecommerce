import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICartItem extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
}

const cartSchema = new Schema<ICartItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.model<ICartItem>("Cart", cartSchema);
