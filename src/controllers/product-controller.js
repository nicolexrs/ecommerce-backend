import Product from "../models/product-model.js";

//add product
export async function addProduct(req, res) {
  try {
    const {
      name,
      price,
      discountPrice,
      description,
      quantity,
      category,
      brand,
    } = req.body;
    const imagesPath = req.files
      ? req.files.map((image) => `/uploads/${image.filename}`)
      : [];
    const product = new Product({
      name,
      price,
      discountPrice,
      description,
      quantity,
      category,
      brand,
      images: imagesPath,
    });
    const savedProduct = await product.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: savedProduct });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating product", error: error.message });
  }
}

//get all products
export async function getAllProducts(req, res) {
  try {
    const products = await Product.find();
    if (!products) {
      return res
        .status(404)
        .json({ message: "Products not available, Please add" });
    }
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving products", error: error.message });
  }
}

//get one product
export async function getProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving product", error: error.message });
  }
}

//update product
export async function updateProduct(req, res) {
  try {
    const {
      name,
      price,
      discountPrice,
      description,
      quantity,
      category,
      brand,
    } = req.body;
    const imagesPath = req.files
      ? req.files.map((image) => `/uploads/${image.filename}`)
      : [];
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          price,
          discountPrice,
          description,
          quantity,
          category,
          brand,
          images: imagesPath,
        },
      },
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(201)
      .json({ message: "Product updated successfully", product: product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
}

//delete product
export async function deleteProduct(req, res) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
}
