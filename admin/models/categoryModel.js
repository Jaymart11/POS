// models/categoryModel.js

const db = require("../database.js");

class CategoryModel {
  getAllCategories(callback) {
    db.query("SELECT * FROM category", callback);
  }

  getCategoryById(categoryId, callback) {
    db.query("SELECT * FROM category WHERE id = ?", [categoryId], callback);
  }

  createCategory(category, callback) {
    db.query("INSERT INTO category SET ?", category, callback);
  }

  updateCategory(categoryId, categoryData, callback) {
    db.query(
      "UPDATE category SET ? WHERE id = ?",
      [categoryData, categoryId],
      callback
    );
  }

  deleteCategory(categoryId, callback) {
    db.query("DELETE FROM category WHERE id = ?", [categoryId], callback);
  }

  getCategoryWithSubProducts(callback) {
    const query = `
        SELECT c.name AS category_name, p.code, p.product_name, p.product_quantity, p.price
        FROM category c 
        LEFT JOIN product p ON c.id = p.category_id 
        ORDER BY c.id, p.id`;
    db.query(query, (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      const categories = [];
      let currentCategory = null;
      results.forEach((row) => {
        if (!currentCategory || currentCategory.id !== row.id) {
          currentCategory = {
            id: row.id,
            name: row.category_name,
            products: [],
          };
          categories.push(currentCategory);
        }
        if (row.product_id) {
          currentCategory.products.push({
            id: row.product_id,
            name: row.product_name,
          });
        }
      });
      callback(null, results);
    });
  }
}

module.exports = new CategoryModel();
