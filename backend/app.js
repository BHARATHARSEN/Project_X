import express from "express"
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "../backend/middlewares/error.js";
import bodyParser from "body-parser";
import cors from "cors";


// Handle unhcaught exceptions

process.on("uncaughtException", (err) => {
  console.log(`ERROR : ${err}`);
  console.log("Shutting down server due to Uncaught exception");
  process.exit(1);
});

dotenv.config({ path: "backend/config/config.env"})
//Connecting to Databse

connectDatabase();

// app.use(express.json({ limit: "10mb" }));

app.use((req, res, next) => {
  console.log("ORIGINAL URL ", req.originalUrl)
  if (req.originalUrl === "/api/v1/payment/webhook") {
    // next();
    express.raw({ type: "application/json" })(req, res, next);
  } else {
    express.json({limit: "10mb"})(req, res, next); 
  }
});

app.use(cookieParser());

import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js'
import orderRoutes from './routes/order.js';
import paymentRoutes from "./routes/payment.js";

app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

// Using error middleware
app.use(errorMiddleware);


const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});

// Handle unhandled Promise Rejections

process.on("unhandledRejection", (err) => {
  console.log(`ERROR : ${err}`);
  console.log("Shutting down server due to Unhandled promise Rejection");
  server.close(() => {
    process.exit(1);
  })


})
