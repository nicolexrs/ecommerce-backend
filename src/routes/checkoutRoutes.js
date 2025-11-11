import express from "express";
import { initCheckout, verifyCheckout } from "../controllers/checkout-controller.js";

const router = express.Router();

router.post("/checkout/init" , initCheckout);
router.get("/checkout/verify" , verifyCheckout);

export default router;