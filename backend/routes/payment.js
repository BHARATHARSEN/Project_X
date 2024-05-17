import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth";
import { stripeCheckoutSession } from "../controllers/paymentControllers";

const router = express.Router();


router
  .route("/payment/checkout_session")
  .post(isAuthenticatedUser, stripeCheckoutSession);



export default router;
