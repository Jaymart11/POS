// models/packagingModel.js

const db = require("../database.js");

class PackagingModel {
  getAllPackagings(callback) {
    db.query("SELECT * FROM packaging WHERE deleted_by IS NULL", callback);
  }

  getPackagingById(packagingId, callback) {
    db.query("SELECT * FROM packaging WHERE id = ?", [packagingId], callback);
  }

  createPackaging(packaging, callback) {
    db.query("INSERT INTO packaging SET ?", packaging, callback);
  }

  updatePackaging(packagingId, packagingData, callback) {
    db.query(
      "UPDATE packaging SET ? WHERE id = ?",
      [packagingData, packagingId],
      callback
    );
  }

  deletePackaging(packagingId, callback) {
    db.query("DELETE FROM packaging WHERE id = ?", [packagingId], callback);
  }
}

module.exports = new PackagingModel();
