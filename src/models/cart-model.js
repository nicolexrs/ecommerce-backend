import mongoose from "mongoose";

//create schema
const cartSchema = new mongoose.Schema(
  {
    cartId: { type: String, unique: true },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        discountPrice: { type: Number },
        images: { type: [String] },
        quantity: { type: Number, default: 1 },
        maxQuantity: { type: Number },
      },
    ],
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

//model
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
