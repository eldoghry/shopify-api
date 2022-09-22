import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    products: {
      type: [
        {
          productId: { type: String },
          quantity: { type: Number, default: 1 },
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", CartSchema);
