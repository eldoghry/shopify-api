import express from "express";
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "../middlewares/verifyToken.js";
import Order from "./../models/Order.js";

const router = express.Router();

//admin can listing all orders
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { new: newQ, status } = req.query;

    let orders;

    if (newQ) {
      orders = await Order.find({}, { __v: 0 })
        .sort({ createdAt: -1 })
        .limit(5);
    } else if (status) {
      orders = await Order.find({ status }, { __v: 0 });
    } else {
      orders = await Order.find({}, { __v: 0 });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// admin or authorized user can get Order
router.get("/:id", verifyToken, async (req, res) => {
  try {
    let order = await Order.findOne({ _id: req.params.id }, { __v: 0 });

    if (req.user.userId !== order.userId && !req.user.isAdmin)
      return res.status(403).json("you are not allowed to access this page");

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
});

// admin only can be delete Order
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete({ _id: req.params.id });

    res.status(200).json("deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
});

// admin only can be update Order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Authorized user can be create Order
router.post("/", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const order = await Order.create({ userId, ...req.body });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Income statistices
router.get("/stats/income", async (_, res) => {
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)); //last month
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1)); //last 2 month

  try {
    const status = await Order.aggregate([
      {
        $match: { createdAt: { $gte: previousMonth } },
      },
      {
        $project: { month: { $month: "$createdAt" }, sales: "$amount" },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);

    res.status(201).json(status);
  } catch (error) {
    res.status(500).json(error);
  }
});

// status statistices
router.get("/stats/status", async (req, res) => {
  try {
    const status = await Order.aggregate([
      {
        $project: { status: 1 },
      },
      {
        $group: { _id: "$status", count: { $sum: 1 } },
      },
    ]);

    res.status(201).json(status);
  } catch (error) {
    res.status(500).json(error);
  }
});

// status statistices
router.get("/stats/ordersPerMonth", async (req, res) => {
  try {
    const status = await Order.aggregate([
      {
        $project: { userId: 1, month: { $month: "$createdAt" } },
      },
      {
        $group: { _id: "$month", count: { $sum: 1 } },
      },
    ]);

    res.status(201).json(status);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
