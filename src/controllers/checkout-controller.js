import dotenv from "dotenv";
import axios from "axios";
import crypto from "crypto";
import Cart from "../models/cart-model.js";
import calculateTotal from "../helpers/helpers.js";

dotenv.config();
const paystackKey = process.env.PAYSTACK_SECRET_KEY;
const paystackUrl = process.env.PAYSTACK_BASE_URL;
const callbackUrl = process.env.PAYSTACK_CALLBACK_URL;

//initiate conversation
export async function initCheckout(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email is required" });
    }
    const cart = await Cart.findOne();
    if (!cart?.items?.length) {
      res.status(400).json({ message: "Cart is empty" });
    }
    const total = calculateTotal(cart.items);
    const amount = Math.round(total * 100);
    const payload = {
      email,
      amount,
      currency: "NGN",
      callback_url: callbackUrl,
      metadata: {
        cartId: cart._id?.toString(),
        items: cart.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    };
    const { data } = await axios.post(
      `${paystackUrl}/transaction/initialize`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${paystackKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!data?.status) {
      res
        .status(400)
        .json({ message: data.message || "Unable to initialize transaction" });
    }
    res.status(200).json({
      message: "Checkout initialized",
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error initializing payment", error: error.message });
  }
}

//verify payment
export async function verifyCheckout(req , res) {
    try {
        const {reference} = req.query;
        if(!reference){
            res.status(400).json({message: "Reference is required"});
        };
        const {data} = await axios.get(
            `${paystackUrl}/transaction/verify/${encodeURIComponent(reference)}`,
            {headers : {Authorization: `Bearer ${paystackKey}`}}
        );
        if(!data.status){
            res.status(400).json({message: data.message || "Unable to verify transaction"});
        };
        const status = data.data.status;
        if(status === "success"){
            await Cart.deleteMany({});
        };
        res.status(200).json({
            message: "Payment verified successfully",
            status,
            paystack: data.data
        });
    } catch (error) {
            res
      .status(500)
      .json({ message: "Error verifying transaction", error: error.message });
    }
}

// paystack webhook
export async function paystackWebhook(req , res) {
    try {
        const signature = req.headers["x-paystack-signature"];
        if (!signature) {
            res.status(401).json({message: "Signature not provided or invalid"})
        };
        const rawData = req.body;
        const computedData = crypto.createHmac("sha512", paystackKey).update(rawData).digest("hex");
        if(computedData !== signature){
            res.status(401).json({message: "signature is invalid"});
        };
        const event = JSON.parse(rawData.toString("utf8"));
        if(event.event === "charge.success" && event.data.status === "success"){
            await Cart.deleteMany({});
        }
        res.status(200).json({ received: true})
    } catch (error) {
        res
      .status(500)
      .json({ message: "internal server error (webhook)", error: error.message });
    }
}