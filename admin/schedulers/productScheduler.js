const cron = require("node-cron");
const db = require("../database");

// Function to log quantities
const productLogQuantities = (isStart) => {
  db.query("SELECT `id`, `product_quantity` FROM `product`", (err, results) => {
    if (err) throw err;

    results.forEach((row) => {
      if (isStart) {
        db.query(
          "INSERT INTO `product_quantity_log` (`product_id`, `start_quantity`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `start_quantity` = VALUES(`start_quantity`)",
          [row.id, row.product_quantity],
          (err) => {
            if (err) throw err;
          }
        );
      } else {
        db.query(
          "UPDATE `product_quantity_log` SET `end_quantity` = ? WHERE `product_id` = ? AND DATE(log_date) = ? ",
          [row.product_quantity, row.id, new Date()],
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
  productLogQuantities(true);
});

// Log end quantities at the end of the day
cron.schedule("54 23 * * *", () => {
  productLogQuantities(false);
});

module.exports = { productLogQuantities };
