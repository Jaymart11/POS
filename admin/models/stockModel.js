// models/expenseModel.js
const db = require("../database");

class StockModel {
  getAllStocks(callback) {
    db.query(
      "select sa.id, sa.product_id, p.product_name, sa.quantity, pc.id as packaging_id, pc.name as packaging_name, sa.type, sa.transaction_date, sa.updated_at, CONCAT(u1.first_name, ' ', u1.last_name) as created_by, CONCAT(u2.first_name, ' ', u2.last_name) AS updated_by from stock_adjustments sa left join product as p on sa.product_id = p.id left join packaging pc on sa.packaging_id = pc.id left join user u1 on sa.created_by = u1.id left join user u2 on sa.updated_by = u2.id order by sa.transaction_date desc",
      callback
    );
  }

  getStockById(stockId, callback) {
    db.query(
      "SELECT * FROM stock_adjustments WHERE id = ?",
      [stockId],
      callback
    );
  }

  createStock(stock, callback) {
    const { product_id, quantity, packaging_id, type } = stock;

    // Insert the new expense
    db.query(
      "INSERT INTO stock_adjustments SET ?",
      stock,
      (insertErr, insertResult) => {
        if (insertErr) {
          return callback(insertErr);
        }

        db.query(
          product_id
            ? type === "restock"
              ? "UPDATE product SET product_quantity = product_quantity + ? WHERE id = ?"
              : "UPDATE product SET product_quantity = product_quantity - ? WHERE id = ?"
            : type === "restock"
            ? "UPDATE packaging SET quantity = quantity + ? WHERE id = ?"
            : "UPDATE packaging SET quantity = quantity - ? WHERE id = ?",
          [parseInt(quantity), product_id ? product_id : packaging_id],
          (updateErr) => {
            if (updateErr) {
              console.error("Failed to update product quantity:", updateErr);
              return callback(null, insertResult);
            }

            // Both queries succeeded
            callback(null, insertResult);
          }
        );
      }
    );
  }

  updateStock(stockId, stockData, callback) {
    const { product_id, quantity, packaging_id, type } = stockData;

    // Update the expense
    db.query(
      "UPDATE stock_adjustments SET ? WHERE id = ?",
      [stockData, stockId],
      (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Failed to update stock_adjustments:", updateErr);
          return callback(updateErr);
        }

        // If it's a product expense and quantity is provided, update the product quantity
        if (product_id && quantity !== undefined) {
          let productUpdateQuery =
            type === "restock"
              ? "UPDATE product SET product_quantity = product_quantity + ? WHERE id = ?"
              : "UPDATE product SET product_quantity = product_quantity - ? WHERE id = ?";
          db.query(
            productUpdateQuery,
            [quantity, product_id],
            (productUpdateErr) => {
              if (productUpdateErr) {
                console.error(
                  "Failed to update product quantity:",
                  productUpdateErr
                );
                return callback(productUpdateErr);
              }
              callback(null, updateResult);
            }
          );
        } else if (packaging_id && quantity !== undefined) {
          let packagingUpdateQuery =
            type === "restock"
              ? "UPDATE packaging SET quantity = quantity + ? WHERE id = ?"
              : "UPDATE packaging SET quantity = quantity - ? WHERE id = ?";
          db.query(
            packagingUpdateQuery,
            [quantity, packaging_id],
            (packagingUpdateErr) => {
              if (packagingUpdateErr) {
                console.error(
                  "Failed to update packaging quantity:",
                  packagingUpdateErr
                );
                return callback(packagingUpdateErr);
              }
              callback(null, updateResult);
            }
          );
        } else {
          // If neither product_id nor packaging_id is provided, just callback with the update result
          callback(null, updateResult);
        }
      }
    );
  }

  deleteStock(stockId, callback) {
    // Fetch the expense details to determine if it's associated with a product or packaging
    db.query(
      "SELECT * FROM stock_adjustments WHERE id = ?",
      [stockId],
      (fetchErr, fetchResult) => {
        if (fetchErr) {
          console.error("Failed to fetch expense details:", fetchErr);
          return callback(fetchErr);
        }

        if (fetchResult.length === 0) {
          // If expense not found, return an error
          const notFoundErr = new Error("Stock not found");
          console.error(notFoundErr.message);
          return callback(notFoundErr);
        }

        const { product_id, packaging_id, quantity, type } = fetchResult[0];

        // Delete the expense
        db.query(
          "DELETE FROM stock_adjustments WHERE id = ?",
          [stockId],
          (deleteErr, deleteResult) => {
            if (deleteErr) {
              console.error("Failed to delete stock_adjustments:", deleteErr);
              return callback(deleteErr);
            }
            db.query(
              product_id
                ? type === "damaged"
                  ? "UPDATE product SET product_quantity = product_quantity + ? WHERE id = ?"
                  : "UPDATE product SET product_quantity = product_quantity - ? WHERE id = ?"
                : type === "damaged"
                ? "UPDATE packaging SET quantity = quantity + ? WHERE id = ?"
                : "UPDATE packaging SET quantity = quantity - ? WHERE id = ?",
              [quantity, product_id ? product_id : packaging_id],
              (productUpdateErr) => {
                if (productUpdateErr) {
                  console.error(
                    "Failed to restore product quantity:",
                    productUpdateErr
                  );
                  return callback(productUpdateErr);
                }
                callback(null, deleteResult);
              }
            );
          }
        );
      }
    );
  }
}

module.exports = new StockModel();
