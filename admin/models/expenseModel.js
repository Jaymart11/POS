// models/expenseModel.js

const mysql = require("mysql");
const db = require("../database");

class ExpenseModel {
  getAllExpenses(callback) {
    db.query(
      "select e.id, e.name, e.amount, e.product_id, p.product_name, e.quantity, pc.id as packaging_id, pc.name as packaging_name from expense as e left join product as p on e.product_id = p.id left join packaging pc on e.packaging_id = pc.id",
      callback
    );
  }

  getTotalExpenses(callback) {
    db.query(
      "SELECT  id, name, amount FROM expense WHERE DATE(expense_date) = CURDATE() AND name IS NOT NULL",
      callback
    );
  }

  getOnlinePayment(callback) {
    db.query(
      "SELECT o.payment_method_id, pm.name, SUM(o.total_price) as total_price FROM orders o LEFT JOIN payment_method pm ON pm.id = o.payment_method_id WHERE DATE(o.order_date) = CURDATE() AND o.payment_method_id != 1 GROUP BY o.payment_method_id, pm.name",
      callback
    );
  }

  getExpenseById(expenseId, callback) {
    db.query("SELECT * FROM expense WHERE id = ?", [expenseId], callback);
  }

  createExpense(expense, callback) {
    const { product_id, quantity, packaging_id, name } = expense;

    // Insert the new expense
    db.query(
      "INSERT INTO expense SET ?",
      expense,
      (insertErr, insertResult) => {
        if (insertErr) {
          return callback(insertErr);
        }

        if (!name) {
          db.query(
            product_id
              ? "UPDATE product SET product_quantity = product_quantity - ? WHERE id = ?"
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
        } else {
          callback(null, insertResult);
        }
      }
    );
  }

  updateExpense(expenseId, expenseData, callback) {
    const { product_id, quantity: newQuantity, packaging_id } = expenseData;

    db.query(
      "SELECT quantity FROM expense WHERE id = ?",
      [expenseId],
      (fetchErr, fetchResult) => {
        if (fetchErr) {
          console.error("Failed to fetch previous quantity:", fetchErr);
          return callback(fetchErr);
        }

        const previousQuantity =
          fetchResult && fetchResult.length ? fetchResult[0].quantity : 0;

        // Update the expense
        db.query(
          "UPDATE expense SET ? WHERE id = ?",
          [expenseData, expenseId],
          (updateErr, updateResult) => {
            if (updateErr) {
              console.error("Failed to update expense:", updateErr);
              return callback(updateErr);
            }

            // Calculate the difference in quantity
            const quantityDifference = parseInt(newQuantity) - previousQuantity;

            // If it's a product expense and quantity is provided, update the product quantity
            if (product_id && newQuantity !== undefined) {
              let productUpdateQuery;
              let productQuantity;
              if (quantityDifference > 0) {
                productUpdateQuery =
                  "UPDATE product SET product_quantity = product_quantity - ? WHERE id = ?";
                productQuantity = newQuantity - previousQuantity;
              } else if (quantityDifference < 0) {
                productUpdateQuery =
                  "UPDATE product SET product_quantity = product_quantity + ? WHERE id = ?";
                productQuantity = previousQuantity - newQuantity;
              }

              if (!productUpdateQuery) return callback(null, updateResult);

              db.query(
                productUpdateQuery,
                [productQuantity, product_id],
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
            } else if (packaging_id && newQuantity !== undefined) {
              let packagingUpdateQuery;
              let packagingQuantity;
              if (quantityDifference > 0) {
                packagingUpdateQuery =
                  "UPDATE packaging SET quantity = quantity - ? WHERE id = ?";
                packagingQuantity = newQuantity - previousQuantity;
              } else if (quantityDifference < 0) {
                packagingUpdateQuery =
                  "UPDATE packaging SET quantity = quantity + ? WHERE id = ?";
                packagingQuantity = previousQuantity - newQuantity;
              }

              if (!packagingUpdateQuery) return callback(null, updateResult);

              db.query(
                packagingUpdateQuery,
                [packagingQuantity, packaging_id],
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
              // If neither packaging_id nor packaging_id is provided, just callback with the update result
              callback(null, updateResult);
            }
          }
        );
      }
    );
  }

  deleteExpense(expenseId, callback) {
    // Fetch the expense details to determine if it's associated with a product or packaging
    db.query(
      "SELECT * FROM expense WHERE id = ?",
      [expenseId],
      (fetchErr, fetchResult) => {
        if (fetchErr) {
          console.error("Failed to fetch expense details:", fetchErr);
          return callback(fetchErr);
        }

        if (fetchResult.length === 0) {
          // If expense not found, return an error
          const notFoundErr = new Error("Expense not found");
          console.error(notFoundErr.message);
          return callback(notFoundErr);
        }

        const { product_id, packaging_id, quantity, name } = fetchResult[0];

        // Delete the expense
        db.query(
          "DELETE FROM expense WHERE id = ?",
          [expenseId],
          (deleteErr, deleteResult) => {
            if (deleteErr) {
              console.error("Failed to delete expense:", deleteErr);
              return callback(deleteErr);
            }

            if (!name) {
              db.query(
                product_id
                  ? "UPDATE product SET product_quantity = product_quantity + ? WHERE id = ?"
                  : "UPDATE packaging SET quantity = quantity + ? WHERE id = ?",
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
            } else {
              callback(null, deleteResult);
            }
          }
        );
      }
    );
  }
}

module.exports = new ExpenseModel();
