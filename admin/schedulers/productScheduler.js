const db = require("../database");
const dayjs = require("dayjs");

// Function to log quantities
const productLogQuantities = (isStart) => {
  db.query(
    "SELECT `id`, `product_quantity` FROM `product` WHERE deleted_by IS NULL",
    (err, results) => {
      if (err) throw err;

      results.forEach((row) => {
        const logDate = dayjs(new Date()).format("YYYY-MM-DD"); // Format date as YYYY-MM-DD
        const query = `
        INSERT INTO \`product_quantity_log\` (\`product_id\`, \`log_date\`, \`${
          isStart ? "start_quantity" : "end_quantity"
        }\`)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
        \`${isStart ? "start_quantity" : "end_quantity"}\` = VALUES(\`${
          isStart ? "start_quantity" : "end_quantity"
        }\`)
      `;

        db.query(query, [row.id, logDate, row.product_quantity], (err) => {
          if (err) throw err;
        });
      });
      console.log(
        "Quantities logged:",
        isStart ? "start" : "end",
        dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
      );
    }
  );
};

module.exports = { productLogQuantities };
