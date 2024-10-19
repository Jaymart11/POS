// database.js

const mysql = require("mysql2");
const config = require("./config");

const db = mysql.createPool({
  ...config.database,
  waitForConnections: true, // ensures connections are queued when pool is full
  connectionLimit: 10, // maximum number of connections in the pool
  queueLimit: 0, // unlimited queueing of connection requests
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database as id " + connection.threadId);
  connection.release(); // release the connection back to the pool
});

module.exports = db;
