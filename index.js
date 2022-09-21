import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import userRouter from "./routes/users.js";

dotenv.config();

const app = express();
const port = 3000;
const DB_URI = process.env.DB_URI;

const client = mongoose
  .connect(DB_URI)
  .then(() => console.log("db connection successfully"))
  .catch((err) => console.log(err));

express.json();
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
