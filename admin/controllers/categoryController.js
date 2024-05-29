// controllers/categoryController.js

const categoryModel = require("../models/categoryModel.js");

exports.getAllCategories = (req, res) => {
  categoryModel.getAllCategories((err, categories) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(categories);
  });
};

exports.getCategoryById = (req, res) => {
  const categoryId = req.params.id;
  categoryModel.getCategoryById(categoryId, (err, category) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json(category);
  });
};

exports.createCategory = (req, res) => {
  const category = req.body;
  categoryModel.createCategory(category, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res
      .status(201)
      .json({ message: "Category created successfully", id: result.insertId });
  });
};

exports.updateCategory = (req, res) => {
  const categoryId = req.params.id;
  const categoryData = req.body;
  categoryModel.updateCategory(categoryId, categoryData, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json({ message: "Category updated successfully" });
  });
};

exports.deleteCategory = (req, res) => {
  const categoryId = req.params.id;
  categoryModel.deleteCategory(categoryId, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json({ message: "Category deleted successfully" });
  });
};

exports.getCategoryWithSubProducts = (req, res) => {
  categoryModel.getCategoryWithSubProducts((err, categories) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(categories);
  });
};
