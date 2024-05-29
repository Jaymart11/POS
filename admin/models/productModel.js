// models/productModel.js

const db = require("../database.js");

class ProductModel {
  getAllProducts(categoryId, callback) {
    let query = "SELECT * FROM product";
    if (categoryId) {
      query += " WHERE category_id = ?";
    }
    db.query(query, [categoryId], callback);
  }

  getProductById(productId, callback) {
    db.query("SELECT * FROM product WHERE id = ?", [productId], callback);
  }

  createProduct(product, callback) {
    db.query("INSERT INTO product SET ?", product, callback);
  }

  updateProduct(productId, productData, callback) {
    db.query(
      "UPDATE product SET ? WHERE id = ?",
      [productData, productId],
      callback
    );
  }

  deleteProduct(productId, callback) {
    db.query("DELETE FROM product WHERE id = ?", [productId], callback);
  }
}

module.exports = new ProductModel();
