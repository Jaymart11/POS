const db = require("../database");

class OrderItemModel {
  createOrderItem(orderItem, callback) {
    db.query("INSERT INTO order_item SET ?", orderItem, callback);
  }

  getOrderItemsByOrderId(orderId, callback) {
    db.query(
      "SELECT * FROM order_item WHERE order_id = ?",
      [orderId],
      callback
    );
  }

  updateOrderItem(orderItemId, orderItemData, callback) {
    db.query(
      "UPDATE order_item SET ? WHERE id = ?",
      [orderItemData, orderItemId],
      callback
    );
  }

  deleteOrderItem(orderItemId, callback) {
    db.query("DELETE FROM order_item WHERE id = ?", [orderItemId], callback);
  }
}

module.exports = new OrderItemModel();
