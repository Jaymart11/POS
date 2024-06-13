// database.js

const mysql = require("mysql2");
const config = require("./config");

const db = mysql.createConnection(config.database);

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database as id " + db.threadId);
});

module.exports = db;
