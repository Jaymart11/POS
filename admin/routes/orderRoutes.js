const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const orderItemController = require("../controllers/orderItemController");

router.get("/", orderController.getAllOrders);
router.get("/report", orderController.exportReport);
router.get("/:id", orderController.getOrderById);
router.post("/", orderController.createOrder);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

// Order items routes
router.post("/:orderId/item", orderItemController.createOrderItem);
router.get("/:orderId/items", orderItemController.getOrderItemsByOrderId);
router.put("/:orderId/item/:itemId", orderItemController.updateOrderItem);
router.delete("/:orderId/item/:itemId", orderItemController.deleteOrderItem);

module.exports = router;
