// models/packagingModel.js

const db = require("../database.js");
const dayjs = require("dayjs");

class PackagingModel {
  getAllPackagings(callback) {
    db.query(
      "SELECT * FROM packaging WHERE deleted_by IS NULL ORDER BY order_num",
      callback
    );
  }

  getPackagingById(packagingId, callback) {
    db.query("SELECT * FROM packaging WHERE id = ?", [packagingId], callback);
  }

  createPackaging(packaging, callback) {
    db.query("INSERT INTO packaging SET ?", packaging, (err, result) => {
      if (err) {
        return callback(err);
      }

      const packagingId = result.insertId;

      db.query(
        `INSERT INTO packaging_quantity_log SET ?`,
        {
          packaging_id: packagingId,
          start_quantity: packaging.quantity,
          log_date: dayjs(new Date()).format("YYYY-MM-DD"),
        },
        (err, result) => {
          if (err) {
            return callback(err);
          }
          return callback(null, result);
        }
      );
    });
  }

  updatePackaging(packagingId, packagingData, callback) {
    db.query(
      "UPDATE packaging SET ? WHERE id = ?",
      [packagingData, packagingId],
      callback
    );
  }

  updateOrderNumber(packagingData, callback) {
    const quantityUpdates = packagingData.map((item) => {
      return new Promise((resolve, reject) => {
        db.query(
          "UPDATE packaging SET order_num = ? WHERE id = ?",
          [item.order_num, item.id],
          (err, result) => {
            if (err) {
              return reject(err);
            }
            resolve(result);
          }
        );
      });
    });

    // Wait for all updates to finish
    Promise.all(quantityUpdates)
      .then((results) => callback(null, results))
      .catch((err) => callback(err));
  }

  deletePackaging(packagingId, callback) {
    db.query("DELETE FROM packaging WHERE id = ?", [packagingId], callback);
  }
}

module.exports = new PackagingModel();
