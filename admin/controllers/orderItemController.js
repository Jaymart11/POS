const orderItemModel = require("../models/orderItemModel");

exports.createOrderItem = (req, res) => {
  const orderItem = req.body;
  orderItemModel.createOrderItem(orderItem, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res
      .status(201)
      .json({
        message: "Order item created successfully",
        id: result.insertId,
      });
  });
};

exports.getOrderItemsByOrderId = (req, res) => {
  const orderId = req.params.orderId;
  orderItemModel.getOrderItemsByOrderId(orderId, (err, items) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(items);
  });
};

exports.updateOrderItem = (req, res) => {
  const orderItemId = req.params.itemId;
  const orderItemData = req.body;
  orderItemModel.updateOrderItem(orderItemId, orderItemData, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Order item not found" });
      return;
    }
    res.json({ message: "Order item updated successfully" });
  });
};

exports.deleteOrderItem = (req, res) => {
  const orderItemId = req.params.itemId;
  orderItemModel.deleteOrderItem(orderItemId, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Order item not found" });
      return;
    }
    res.json({ message: "Order item deleted successfully" });
  });
};
