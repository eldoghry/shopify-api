import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    desc: {
      type: String,
      required: true,
    },

    img: {
      type: String,
      required: true,
    },

    categories: {
      type: [],
      required: true,
    },

    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },

    status: {
      type: String,
      required: true,
      default: "active",
    },

    sizes: {
      type: [],
    },

    colors: { type: [] },

    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", ProductSchema);
