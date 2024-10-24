// routes/packagingRoutes.js

const express = require("express");
const router = express.Router();
const packagingController = require("../controllers/packagingController.js");

router.put("/order_num", packagingController.updateOrderNumber);
router.get("/", packagingController.getAllPackagings);
router.get("/:id", packagingController.getPackagingById);
router.post("/", packagingController.createPackaging);
router.put("/:id", packagingController.updatePackaging);
router.delete("/:id", packagingController.deletePackaging);

module.exports = router;
