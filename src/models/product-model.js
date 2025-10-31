import mongoose from "mongoose";

//product schema
const productSchema = new mongoose.Schema({
    name: {type: String , required:[true, "Product name is required"], trim: true},
    price: {type: Number , required:[true, "Price is required"], trim: true}, 
    discountPrice: {type: Number , trim: true},
    images: {type: [String], default: []},
    description:{type: String},
    quantity: {type: Number , default: 1}
})

//product model
const Product = mongoose.model("Product" , productSchema);

export default Product;