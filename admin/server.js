// app.js

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const accessLevelRoutes = require("./routes/accessLevelRoutes.js");
const packagingRoutes = require("./routes/packagingRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const expenseRoutes = require("./routes/expenseRoutes.js");
const stockRoutes = require("./routes/stockRoutes.js");
const packagingScheduler = require("./schedulers/packagingScheduler.js");
const settingRoutes = require("./routes/settingRoutes.js");
const productScheduler = require("./schedulers/productScheduler.js");

// Middleware
app.use(bodyParser.json());
app.use(cors());

// cron
app.get("/log-quantities/start", (req, res) => {
  packagingScheduler.logQuantities(true);
  res.send("Start packaging quantities logged manually.");
});
app.get("/log-quantities/end", (req, res) => {
  packagingScheduler.logQuantities(false);
  res.send("End packaging quantities logged manually.");
});

app.get("/product-log-quantities/start", (req, res) => {
  productScheduler.productLogQuantities(true);
  res.send("Start product quantities logged manually.");
});
app.get("/product-log-quantities/end", (req, res) => {
  productScheduler.productLogQuantities(false);
  res.send("End product quantities logged manually.");
});

// Example home route

// Routes
app.use("/users", userRoutes);
app.use("/access-levels", accessLevelRoutes);
app.use("/packaging", packagingRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/expense", expenseRoutes);
app.use("/stock", stockRoutes);
app.use("/setting", settingRoutes);
// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
