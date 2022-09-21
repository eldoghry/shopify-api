import express from "express";
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "../middlewares/verifyToken.js";
import User from "./../models/User.js";

const router = express.Router();


//admin only can listing all users
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { new: newQ } = req.query;

    let users;

    if (newQ) {
      users = await User.find({}, { password: 0, __v: 0 })
        .sort({ createdAt: -1 })
        .limit(2);
    } else {
      users = await User.find({}, { password: 0, __v: 0 });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// admin or user can get user
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    let user = await User.findOne(
      { _id: req.params.id },
      { password: 0, __v: 0 }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

// admin only can be delete user
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete({ _id: req.params.id });

    res.status(201).json("deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
