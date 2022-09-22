import express from "express";
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "../middlewares/verifyToken.js";
import Cart from "./../models/Cart.js";

const router = express.Router();

//admin can listing all Carts
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find({});

    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

// admin or authorized user can get cart
// id is userId not cart id
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.id }, { __v: 0 });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// admin only can be delete cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.id });

    res.status(200).json("deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Authorized user only can be update cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updated = await Cart.findOneAndUpdate(
      { userId: req.params.id },
      req.body,
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Authorized user can be create cart
router.post("/", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const cart = await Cart.create({ userId, ...req.body });

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
