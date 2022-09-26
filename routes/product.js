import express from "express";
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "../middlewares/verifyToken.js";
import Product from "./../models/Product.js";

const router = express.Router();

// admin only can be create product
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

//everyone can listing products
router.get("/", async (req, res) => {
  try {
    const { new: newQ, categories } = req.query;

    let products;

    if (newQ) {
      products = await Product.find({}, { __v: 0 })
        .sort({ createdAt: -1 })
        .limit(5);
    } else if (categories) {
      const searchItems = categories.split(",");

      products = await Product.find(
        { categories: { $in: searchItems } },
        { __v: 0 }
      );
    } else {
      products = await Product.find({}, { __v: 0 });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

// everyone can get product
router.get("/:id", async (req, res) => {
  try {
    let product = await Product.findOne({ _id: req.params.id }, { __v: 0 });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
});

// admin only can be delete product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete({ _id: req.params.id });

    res.status(200).json("deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
});

// admin only can be update product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
