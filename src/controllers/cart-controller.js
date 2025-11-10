import Product from "../models/product-model.js";
import Cart from "../models/cart-model.js";
import calculateTotal from "../helpers/helpers.js";

//add to cart
export async function addToCart(req, res) {
  try {
    //destructure productId and quantity from request body
    const { productId, quantity } = req.body;

    //check if product is available
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not available" });
    }

    //get cart or create new one
    let cart = await cart.findOne();
    if (!cart) {
      cart = new Cart({ items: [] });
    }

    //check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      //update quantity
      existingItem.quantity += quantity || 1;
    } else {
      //add new item to cart
      cart.items.push({
        productId: productId,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        quantity: quantity || 1,
        images: product.images,
        maxQuantity: product.quantity,
      });
    }
    //update total price
    cart.totalPrice = calculateTotal(cart.items);

    //save cart
    await cart.save();

    //send response
    res
      .status(200)
      .json({ message: "Product added to cart successfully", cart });
  } catch (error) {
    //send error response
    res.status(500).json({
      message: "Error adding product to cart",
      error: error.message,
    });
  }
}

//get cart items
export async function getCart(req, res) {
  try {
    //find cart
    const cart = await Cart.findOne();

    //if cart not found
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    //send cart response
    res.status(200).json({
      message: "Cart successfully retrieved",
      cart,
    });
  } catch (error) {

    //send error response 
    res.status(500).json({
      message: "Error retieving cart",
      error: error.message,
    });
  }
}

//update item quantity in cart
export async function updateCartItem(req, res) {
  try {
    //destructure productId and quantity from request body
    const { productId, quantity } = req.body;
    //check if productId and quantity are provided
    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required" });
    }
    //find cart
    let cart = await Cart.findOne();
    //check if cart exists
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    //find item in cart
    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    //check if item exists
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    //update item quantity
    item.quantity = quantity;
    //update total price
    cart.totalPrice = calculateTotal(cart.items);
    //save cart
    await cart.save();
    //send response
    res.status(200).json({ message: "Cart item updated successfully", cart });
  } catch (error) {
    //send error response
    res.status(500).json({
      message: "Error updating cart",
      error: error.message,
    });
  }
}

//remove item from cart
export async function removeFromCart(req, res) {
  try {
    //destructure productId from request body
    const { productId } = req.body;
    //find cart
    let cart = await Cart.findOne();
    //check if cart exists
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    //remove item from cart
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    //update total price
    cart.totalPrice = calculateTotal(cart.items);
    //save cart
    await cart.save();
    //send response
    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    //send error response
    res.status(500).json({
      message: "Error removing product from cart",
      error: error.message,
    });
  }
}

//clear cart
export async function clearCart(req , res) {
  try {
    //delete all cart items
    await Cart.deleteMany({});
    //send response
    res.status(200).json({message: "Cart cleared successfully"})
  } catch (error) {
    //send error response
    res.status(500).json({
      message: "Error clearing cart",
      error: error.message,
    });
  }
}