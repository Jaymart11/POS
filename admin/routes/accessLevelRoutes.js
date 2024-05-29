// routes/accessLevelRoutes.js

const express = require("express");
const router = express.Router();
const accessLevelController = require("../controllers/accessLevelController.js");

router.get("/", accessLevelController.getAllAccessLevels);
router.get("/:id", accessLevelController.getAccessLevelById);
router.post("/", accessLevelController.createAccessLevel);
router.put("/:id", accessLevelController.updateAccessLevel);
router.delete("/:id", accessLevelController.deleteAccessLevel);

module.exports = router;
