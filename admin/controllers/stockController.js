// controllers/stockController.js

const stockModel = require("../models/stockModel");

exports.getAllStocks = (req, res) => {
  stockModel.getAllStocks((err, stocks) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(stocks);
  });
};

exports.getStockById = (req, res) => {
  const stockId = req.params.id;
  stockModel.getStockById(stockId, (err, stock) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (!stock) {
      res.status(404).json({ error: "Stock not found" });
      return;
    }
    res.json(stock);
  });
};

exports.createStock = (req, res) => {
  const stock = req.body;
  stockModel.createStock(stock, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res
      .status(201)
      .json({ message: "Stock created successfully", id: result.insertId });
  });
};

exports.updateStock = (req, res) => {
  const stockId = req.params.id;
  const stockData = req.body;
  stockModel.updateStock(stockId, stockData, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Stock not found" });
      return;
    }
    res.json({ message: "Stock updated successfully" });
  });
};

exports.deleteStock = (req, res) => {
  const stockId = req.params.id;
  stockModel.deleteStock(stockId, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Stock not found" });
      return;
    }
    res.json({ message: "Stock deleted successfully" });
  });
};
