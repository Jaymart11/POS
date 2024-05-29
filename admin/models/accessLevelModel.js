// models/accessLevelModel.js

const db = require("../database.js");

class AccessLevelModel {
  getAllAccessLevels(callback) {
    db.query("SELECT * FROM access_level", callback);
  }

  getAccessLevelById(accessLevelId, callback) {
    db.query(
      "SELECT * FROM access_level WHERE id = ?",
      [accessLevelId],
      callback
    );
  }

  createAccessLevel(accessLevel, callback) {
    db.query("INSERT INTO access_level SET ?", accessLevel, callback);
  }

  updateAccessLevel(accessLevelId, accessLevelData, callback) {
    db.query(
      "UPDATE access_level SET ? WHERE id = ?",
      [accessLevelData, accessLevelId],
      callback
    );
  }

  deleteAccessLevel(accessLevelId, callback) {
    db.query(
      "DELETE FROM access_level WHERE id = ?",
      [accessLevelId],
      callback
    );
  }
}

module.exports = new AccessLevelModel();
