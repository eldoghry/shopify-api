import express from "express";
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "../middlewares/verifyToken.js";
import User from "./../models/User.js";

const router = express.Router();

// router.put("/:id", async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

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

export default router;
