// controllers/productController.js

const productModel = require("../models/productModel.js");
const { productLogQuantities } = require("../schedulers/productScheduler.js");

exports.getAllProducts = (req, res) => {
  const categoryId = req.query.categoryId;
  productModel.getAllProducts(categoryId, (err, products) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(products);
  });
};

exports.getProductById = (req, res) => {
  const productId = req.params.id;
  productModel.getProductById(productId, (err, product) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  });
};

exports.createProduct = (req, res) => {
  const product = req.body;
  productModel.createProduct(product, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    productLogQuantities(true);
    res
      .status(201)
      .json({ message: "Product created successfully", id: result.insertId });
  });
};

exports.updateProduct = (req, res) => {
  const productId = req.params.id;
  let productData = req.body;

  if (productData.restock) {
    productData = {
      product_quantity:
        productData.restock === "restock"
          ? productData.product_quantity + parseInt(productData.quantity)
          : productData.product_quantity - parseInt(productData.quantity),
    };
  }

  productModel.updateProduct(productId, productData, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ message: "Product updated successfully" });
  });
};

exports.deleteProduct = (req, res) => {
  const productId = req.params.id;
  productModel.deleteProduct(productId, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted successfully" });
  });
};
