// controllers/settingController.js

const settingModel = require("../models/settingModel.js");

exports.getAllSettings = (req, res) => {
  settingModel.getAllSettings((err, settings) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(settings[0]);
  });
};

exports.getLowQuantity = (req, res) => {
  settingModel.getLowQuantity((err, settings) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(settings);
  });
};

exports.getSettingById = (req, res) => {
  const settingId = req.params.id;
  settingModel.getSettingById(settingId, (err, setting) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (!setting) {
      res.status(404).json({ error: "Settings not found" });
      return;
    }
    res.json(setting);
  });
};

exports.createSetting = (req, res) => {
  const setting = req.body;
  settingModel.createSetting(setting, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(201).json({
      message: "Settings created successfully",
      id: result.insertId,
    });
  });
};

exports.updateSetting = (req, res) => {
  const settingId = req.params.id;
  const settingData = req.body;
  settingModel.updateSetting(settingId, settingData, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Settings not found" });
      return;
    }
    res.json({ message: "Settings updated successfully" });
  });
};

exports.deleteSetting = (req, res) => {
  const settingId = req.params.id;
  settingModel.deleteSetting(settingId, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Settings not found" });
      return;
    }
    res.json({ message: "Settings deleted successfully" });
  });
};
