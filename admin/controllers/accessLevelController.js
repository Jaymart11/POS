// controllers/accessLevelController.js

const accessLevelModel = require("../models/accessLevelModel.js");

exports.getAllAccessLevels = (req, res) => {
  accessLevelModel.getAllAccessLevels((err, accessLevels) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(accessLevels);
  });
};

exports.getAccessLevelById = (req, res) => {
  const accessLevelId = req.params.id;
  accessLevelModel.getAccessLevelById(accessLevelId, (err, accessLevel) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (!accessLevel) {
      res.status(404).json({ error: "Access level not found" });
      return;
    }
    res.json(accessLevel);
  });
};

exports.createAccessLevel = (req, res) => {
  const accessLevel = req.body;
  accessLevelModel.createAccessLevel(accessLevel, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res
      .status(201)
      .json({
        message: "Access level created successfully",
        id: result.insertId,
      });
  });
};

exports.updateAccessLevel = (req, res) => {
  const accessLevelId = req.params.id;
  const accessLevelData = req.body;
  accessLevelModel.updateAccessLevel(
    accessLevelId,
    accessLevelData,
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: "Access level not found" });
        return;
      }
      res.json({ message: "Access level updated successfully" });
    }
  );
};

exports.deleteAccessLevel = (req, res) => {
  const accessLevelId = req.params.id;
  accessLevelModel.deleteAccessLevel(accessLevelId, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Access level not found" });
      return;
    }
    res.json({ message: "Access level deleted successfully" });
  });
};
