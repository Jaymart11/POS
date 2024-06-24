// models/productModel.js

const db = require("../database.js");

class ProductModel {
  getAllProducts(categoryId, callback) {
    let query =
      "SELECT p.*, pk.quantity FROM product p LEFT JOIN packaging pk ON pk.id = packaging_id";
    if (categoryId) {
      query += " WHERE p.category_id = ? AND p.deleted_by IS NULL";
    } else {
      query += " WHERE p.deleted_by IS NULL";
    }

    query += " ORDER BY p.category_id";
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
