import express from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cart-controller.js";

const router = express.Router();

router.post("/cart/add", addToCart);
router.put("/cart/update", updateCartItem);
router.delete("/cart/remove", removeFromCart);
router.delete("/cart/clear", clearCart);
router.get("/cart", getCart);

export default router;
