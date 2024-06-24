const cron = require("node-cron");
const db = require("../database");
const dayjs = require("dayjs");

// Function to log quantities
const logQuantities = (isStart) => {
  db.query(
    "SELECT `id`, `quantity` FROM `packaging` WHERE deleted_by IS NULL",
    (err, results) => {
      if (err) throw err;

      results.forEach((row) => {
        const logDate = dayjs(new Date()).format("YYYY-MM-DD"); // Format date as YYYY-MM-DD
        const query = `
        INSERT INTO \`packaging_quantity_log\` (\`packaging_id\`, \`log_date\`, \`${
          isStart ? "start_quantity" : "end_quantity"
        }\`)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
        \`${isStart ? "start_quantity" : "end_quantity"}\` = VALUES(\`${
          isStart ? "start_quantity" : "end_quantity"
        }\`)
      `;

        db.query(query, [row.id, logDate, row.quantity], (err) => {
          if (err) throw err;
        });
      });
      console.log("Quantities logged:", isStart ? "start" : "end");
    }
  );
};

// Schedule tasks
// Log start quantities at the beginning of the day
cron.schedule("0 0 * * *", () => {
  logQuantities(true);
});

// Log end quantities at the end of the day
cron.schedule("59 23 * * *", () => {
  logQuantities(false);
});

module.exports = { logQuantities };
