import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    products: {
      type: [
        {
          productId: { type: String },
        },

        {
          quantity: { type: Number, default: 1 },
        },
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      required: true,
      default: "pending",
    },

    address: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
