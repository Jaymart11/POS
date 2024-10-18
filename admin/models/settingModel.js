// models/settingModel.js

const db = require("../database.js");

class SettingModel {
  getAllSettings(callback) {
    db.query("SELECT * FROM settings", callback);
  }

  getLowQuantity(callback) {
    db.query(
      "select p.id, 'Packaging' as item_type,  p.name, p.quantity from packaging p cross join settings s where deleted_by IS NULL AND p.quantity < s.stock_notification union all select p.id, 'Product' as item_type, p.product_name, p.product_quantity from product p cross join settings s where deleted_by IS NULL AND p.product_quantity < s.stock_notification order by quantity",
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
