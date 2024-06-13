// models/expenseModel.js
const db = require("../database");

class ExpenseModel {
  getAllExpenses(callback) {
    db.query(
      "SELECT e.*, CONCAT(u1.first_name, ' ', u1.last_name) as created_by, CONCAT(u2.first_name, ' ', u2.last_name) AS updated_by from expense e left join user u1 on e.created_by = u1.id left join user u2 on e.updated_by = u2.id ORDER BY expense_date desc",
      callback
    );
  }

  getTotalExpenses(callback) {
    db.query(
      "SELECT  id, name, amount FROM expense WHERE DATE(expense_date) = CURDATE()",
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
