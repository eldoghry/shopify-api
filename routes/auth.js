import express from "express";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
  const { username, password: orginalPassword, email } = req.body;
  const PEPPER = process.env.PEPPER;

  try {
    const hash = CryptoJS.AES.encrypt(orginalPassword, PEPPER).toString();
    const user = await User.create({ username, email, password: hash });
    const { password, ...other } = user._doc;

    res.status(201).json({ ...other });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  const { username, password: orginalPassword } = req.body;
  const PEPPER = process.env.PEPPER;
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

  try {
    const user = await User.findOne({ username });

    const decrepted = CryptoJS.AES.decrypt(user.password, PEPPER).toString(
      CryptoJS.enc.Utf8
    );

    if (!user || orginalPassword !== decrepted)
      return res.status(401).json("wrong credinals");

    const ACCESS_TOKEN = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      JWT_SECRET_KEY,
      {
        expiresIn: "2d",
      }
    );

    const { password, ...other } = user._doc;

    res.status(202).json({ ...other, ACCESS_TOKEN });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
