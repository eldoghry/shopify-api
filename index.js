import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import productRouter from "./routes/product.js";
import orderRouter from "./routes/order.js";
import cartRouter from "./routes/cart.js";

dotenv.config();

const app = express();
const port = 3000;
const DB_URI = process.env.DB_URI;

const client = mongoose
  .connect(DB_URI)
  .then(() => console.log("db connection successfully"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
