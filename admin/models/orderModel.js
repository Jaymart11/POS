const db = require("../database");

class OrderModel {
  getAllOrders(callback) {
    db.query("SELECT * FROM `orders`", callback);
  }

  getOrderById(orderId, callback) {
    db.query(
      "SELECT * FROM `orders` WHERE id = ?",
      [orderId],
      (err, orderResult) => {
        if (err) return callback(err);
        if (orderResult.length === 0) return callback(null, null);

        db.query(
          "SELECT * FROM order_item WHERE order_id = ?",
          [orderId],
          (err, itemsResult) => {
            if (err) return callback(err);
            callback(null, { order: orderResult[0], items: itemsResult });
          }
        );
      }
    );
  }

  createOrder(orderData, items, callback) {
    db.query("INSERT INTO `orders` SET ?", orderData, (err, result) => {
      if (err) return callback(err);

      const orderId = result.insertId;
      const orderItems = items.map((item) => ({
        ...item,
        order_id: orderId,
      }));

      const orderItemValues = orderItems.map((item) => [
        item.order_id,
        item.product_id,
        item.packaging_id,
        item.quantity,
        item.price_at_order,
      ]);

      db.query(
        "INSERT INTO order_item (order_id, product_id, packaging_id, quantity, price_at_order) VALUES ?",
        [orderItemValues],
        (err) => {
          if (err) return callback(err);

          const quantityUpdates = orderItems.map(
            (item) =>
              new Promise((resolve, reject) => {
                db.query(
                  "UPDATE product SET product_quantity = product_quantity - ? WHERE id = ?",
                  [item.quantity, item.product_id],
                  (err) => {
                    if (err) reject(err);

                    db.query(
                      "UPDATE packaging SET quantity = quantity - ? WHERE id = ?",
                      [item.quantity, item.packaging_id],
                      (err) => {
                        if (err) reject(err);
                        else resolve();
                      }
                    );
                  }
                );
              })
          );

          Promise.all(quantityUpdates)
            .then(() => callback(null, orderId))
            .catch((err) => callback(err));
        }
      );
    });
  }

  updateOrder(orderId, orderData, items, callback) {
    db.query(
      "UPDATE `orders` SET ? WHERE id = ?",
      [orderData, orderId],
      (err, result) => {
        if (err) return callback(err);
        if (result.affectedRows === 0) return callback(null, null);

        db.query(
          "DELETE FROM order_item WHERE order_id = ?",
          [orderId],
          (err, result) => {
            if (err) return callback(err);
            const orderItems = items.map((item) => ({
              ...item,
              order_id: orderId,
            }));
            db.query(
              "INSERT INTO order_item (order_id, product_id, packaging_id, quantity, price_at_order) VALUES ?",
              [
                orderItems.map((item) => [
                  item.order_id,
                  item.product_id,
                  item.packaging_id,
                  item.quantity,
                  item.price_at_order,
                ]),
              ],
              callback
            );
          }
        );
      }
    );
  }

  deleteOrder(orderId, callback) {
    db.query(
      "DELETE FROM order_item WHERE order_id = ?",
      [orderId],
      (err, result) => {
        if (err) return callback(err);
        db.query("DELETE FROM `orders` WHERE id = ?", [orderId], callback);
      }
    );
  }

  getReports(callback) {
    db.query(
      `SELECT 
    c.id,
    c.name AS category_name,
    p.product_name,
    p.price,
    SUM(oi.quantity * p.price) AS total_sales,
    SUM(oi.quantity) AS total_quantity
FROM 
    orders o
    LEFT JOIN order_item oi ON o.id = oi.order_id
    LEFT JOIN product p ON p.id = oi.product_id
    LEFT JOIN category c ON c.id = p.category_id
WHERE 
    DATE(o.order_date) = curdate()
GROUP BY p.id ORDER BY c.id`,
      callback
    );
  }
}

module.exports = new OrderModel();
