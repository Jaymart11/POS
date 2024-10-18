// routes/settingRoutes.js

const express = require("express");
const router = express.Router();
const settingController = require("../controllers/settingController.js");

router.get("/low_quantity/", settingController.getLowQuantity);
router.get("/", settingController.getAllSettings);
router.get("/:id", settingController.getSettingById);
router.post("/", settingController.createSetting);
router.put("/:id", settingController.updateSetting);
router.delete("/:id", settingController.deleteSetting);

module.exports = router;
