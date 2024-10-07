// models/expenseModel.js
const db = require("../database");

class ExpenseModel {
  getAllExpenses(callback) {
    db.query(
      "SELECT e.*, CONCAT(u1.first_name, ' ', u1.last_name) as created_by, CONCAT(u2.first_name, ' ', u2.last_name) AS updated_by from expense e left join user u1 on e.created_by = u1.id left join user u2 on e.updated_by = u2.id ORDER BY expense_date desc",
      callback
    );
  }

  getTotalExpenses(data, callback) {
    db.query(
      `SELECT  id, name, amount FROM expense WHERE DATE(expense_date) BETWEEN '${
        data.date[0]
      }' AND '${data.date[1]}' ${
        data.user_id !== 0 ? "AND created_by =" + data.user_id : ""
      }`,
      callback
    );
  }

  getOnlinePayment(data, callback) {
    db.query(
      `SELECT pm.id AS payment_method_id, pm.name, COALESCE(SUM(o.total_price), 0) AS total_price FROM payment_method pm LEFT JOIN orders o ON pm.id = o.payment_method_id AND DATE(o.order_date) BETWEEN '${
        data.date[0]
      }' AND '${data.date[1]}' ${
        data.user_id !== 0 ? "AND o.user_id =" + data.user_id : ""
      } WHERE pm.id != 1 GROUP BY pm.id, pm.name`,
      callback
    );
  }

  getExpenseById(expenseId, callback) {
    db.query("SELECT * FROM expense WHERE id = ?", [expenseId], callback);
  }

  createExpense(expense, callback) {
    db.query("INSERT INTO expense SET ?", expense, callback);
  }

  updateExpense(expenseId, expenseData, callback) {
    console.log(expenseData);
    db.query(
      "UPDATE expense SET ? WHERE id = ?",
      [expenseData, expenseId],
      callback
    );
  }

  deleteExpense(expenseId, callback) {
    db.query("DELETE FROM expense WHERE id = ?", [expenseId], callback);
  }
}

module.exports = new ExpenseModel();
