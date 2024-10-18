// models/settingModel.js

const db = require("../database.js");

class SettingModel {
  getAllSettings(callback) {
    db.query("SELECT * FROM settings", callback);
  }

  getSettingById(settingId, callback) {
    db.query("SELECT * FROM settings WHERE id = ?", [settingId], callback);
  }

  createSetting(setting, callback) {
    db.query("INSERT INTO settings SET ?", setting, callback);
  }

  updateSetting(settingId, settingData, callback) {
    db.query(
      "UPDATE settings SET ? WHERE id = ?",
      [settingData, settingId],
      callback
    );
  }

  deleteSetting(settingId, callback) {
    db.query("DELETE FROM settings WHERE id = ?", [settingId], callback);
  }
}

module.exports = new SettingModel();
