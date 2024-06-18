const cron = require("node-cron");
const db = require("../database");

// Function to log quantities
const logQuantities = (isStart) => {
  db.query("SELECT `id`, `quantity` FROM `packaging`", (err, results) => {
    if (err) throw err;

    results.forEach((row) => {
      if (isStart) {
        db.query(
          "INSERT INTO `packaging_quantity_log` (`packaging_id`, `start_quantity`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `start_quantity` = VALUES(`start_quantity`)",
          [row.id, row.quantity],
          (err) => {
            if (err) throw err;
          }
        );
      } else {
        db.query(
          "UPDATE `packaging_quantity_log` SET `end_quantity` = ? WHERE `packaging_id` = ? AND DATE(log_date) = ? ",
          [row.quantity, row.id, new Date()],
          (err) => {
            if (err) throw err;
          }
        );
      }
    });
    console.log("Quantities logged:", isStart ? "start" : "end");
  });
};

// Schedule tasks
// Log start quantities at the beginning of the day
cron.schedule("0 0 * * *", () => {
  logQuantities(true);
});

// Log end quantities at the end of the day
cron.schedule("54 23 * * *", () => {
  logQuantities(false);
});

module.exports = { logQuantities };
