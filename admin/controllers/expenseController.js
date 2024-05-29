// controllers/expenseController.js

const expenseModel = require("../models/expenseModel");

exports.getAllExpenses = (req, res) => {
  expenseModel.getAllExpenses((err, expenses) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(expenses);
  });
};

exports.getExpenseById = (req, res) => {
  const expenseId = req.params.id;
  expenseModel.getExpenseById(expenseId, (err, expense) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (!expense) {
      res.status(404).json({ error: "Expense not found" });
      return;
    }
    res.json(expense);
  });
};

exports.createExpense = (req, res) => {
  const expense = req.body;
  expenseModel.createExpense(expense, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res
      .status(201)
      .json({ message: "Expense created successfully", id: result.insertId });
  });
};

exports.updateExpense = (req, res) => {
  const expenseId = req.params.id;
  const expenseData = req.body;
  expenseModel.updateExpense(expenseId, expenseData, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Expense not found" });
      return;
    }
    res.json({ message: "Expense updated successfully" });
  });
};

exports.deleteExpense = (req, res) => {
  const expenseId = req.params.id;
  expenseModel.deleteExpense(expenseId, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Expense not found" });
      return;
    }
    res.json({ message: "Expense deleted successfully" });
  });
};
