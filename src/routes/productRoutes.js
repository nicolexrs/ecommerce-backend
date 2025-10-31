import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product-controller.js";
import upload from "../middlewares/file-upload.js";

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/product/:id", getProduct);
router.post("/product", upload.array("images", 10), addProduct);
router.patch("/product/:id", upload.array("images", 10), updateProduct);
router.delete("/product/:id", deleteProduct);

export default router;
