import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
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

/**
 * Get all users
 *
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
