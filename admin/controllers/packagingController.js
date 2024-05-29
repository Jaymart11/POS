// controllers/packagingController.js

const packagingModel = require("../models/packagingModel.js");

exports.getAllPackagings = (req, res) => {
  packagingModel.getAllPackagings((err, packagings) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(packagings);
  });
};

exports.getPackagingById = (req, res) => {
  const packagingId = req.params.id;
  packagingModel.getPackagingById(packagingId, (err, packaging) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (!packaging) {
      res.status(404).json({ error: "Packaging not found" });
      return;
    }
    res.json(packaging);
  });
};

exports.createPackaging = (req, res) => {
  const packaging = req.body;
  packagingModel.createPackaging(packaging, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res
      .status(201)
      .json({ message: "Packaging created successfully", id: result.insertId });
  });
};

exports.updatePackaging = (req, res) => {
  const packagingId = req.params.id;
  const packagingData = req.body;
  packagingModel.updatePackaging(packagingId, packagingData, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Packaging not found" });
      return;
    }
    res.json({ message: "Packaging updated successfully" });
  });
};

exports.deletePackaging = (req, res) => {
  const packagingId = req.params.id;
  packagingModel.deletePackaging(packagingId, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Packaging not found" });
      return;
    }
    res.json({ message: "Packaging deleted successfully" });
  });
};
