// models/settingModel.js

const db = require("../database.js");

class SettingModel {
  getAllSettings(callback) {
    db.query("SELECT * FROM settings", callback);
  }

  getLowQuantity(callback) {
    db.query(
      "SELECT id, 'Packaging' as item_type, name, quantity from packaging where quantity < stock_notification AND deleted_by IS NULL UNION ALL SELECT id, 'Product' as item_type, product_name, product_quantity from product where product_quantity < stock_notification AND deleted_by IS NULL ORDER BY quantity",
      callback
    );
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
