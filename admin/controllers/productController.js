// controllers/productController.js

const productModel = require("../models/productModel.js");

exports.getAllProducts = (req, res) => {
  const categoryId = req.query.categoryId;
  productModel.getAllProducts(categoryId, (err, products) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const result = products.reduce(
      (
        acc,
        {
          id,
          packaging_id,
          packaging_name,
          quantity,
          packaging_stock_notification,
          conversion_product_id,
          conversion_product_name,
          conversion_ratio,
          ...rest
        }
      ) => {
        acc[id] = acc[id] || {
          ...rest,
          id,
          packaging_details: [],
          product_conversion: [],
        };

        // Check for duplicates in packaging_details based on packaging_id
        if (
          !acc[id].packaging_details.some(
            (detail) => detail.packaging_id === packaging_id
          )
        ) {
          acc[id].packaging_details.push({
            packaging_id,
            packaging_name,
            quantity,
            packaging_stock_notification,
          });
        }

        // Check for duplicates in product_conversion based on conversion_product_id
        if (
          !acc[id].product_conversion.some(
            (conversion) =>
              conversion.conversion_product_id === conversion_product_id
          )
        ) {
          acc[id].product_conversion.push({
            conversion_product_id,
            conversion_product_name,
            conversion_ratio,
          });
        }

        acc[id].product_conversion.sort(
          (a, b) => a.conversion_ratio - b.conversion_ratio
        );

        return acc;
      },
      {}
    );

    const finalArray = Object.values(result);

    res.json(
      finalArray.sort((a, b) => {
        // Compare by category_id first
        if (a.category_id > b.category_id) return 1;
        if (a.category_id < b.category_id) return -1;

        // If category_id is the same, compare by order_num
        if (a.order_num > b.order_num) return 1;
        if (a.order_num < b.order_num) return -1;

        // If both are the same, return 0 (they're equal in sorting)
        return 0;
      })
    );
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

exports.updateOrderNumber = (req, res) => {
  const productData = req.body;
  productModel.updateOrderNumber(productData, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ message: "Product order updated successfully" });
  });
};

exports.deleteProduct = (req, res) => {
  const productId = req.params.id;
  let productData = req.body;
  productModel.deleteProduct(productId, productData, (err, result) => {
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
