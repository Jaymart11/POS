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
    oi.price_at_order as price,
    SUM(oi.quantity * oi.price_at_order) AS total_sales,
    SUM(oi.quantity) AS total_quantity
    FROM 
        orders o
        LEFT JOIN order_item oi ON o.id = oi.order_id
        LEFT JOIN product p ON p.id = oi.product_id
        LEFT JOIN category c ON c.id = p.category_id
    WHERE 
        DATE(o.order_date) = curdate()
    GROUP BY c.id, c.name, p.id, p.product_name, oi.price_at_order
    ORDER BY c.id, p.product_name`,
      callback
    );
  }

  getStocksReports(callback) {
    db.query(
      `
SELECT 
    p.category_id, 
    c.name AS category_name, 
    p.product_name, 
    pq.start_quantity as 'starting', 
    COALESCE(e.dmg_quantity, 0) AS damaged, 
    COALESCE(e.restk_quantity, 0) AS restock, 
    t.total_quantity AS releasing,
	p.product_quantity as ending
    FROM 
        product_quantity_log pq 
    LEFT JOIN 
        product p ON p.id = pq.product_id 
    LEFT JOIN 
        category c ON c.id = p.category_id 
    LEFT JOIN 
    (
        SELECT 
            product_id, 
            SUM(CASE WHEN type = 'damaged' THEN quantity ELSE 0 END) AS dmg_quantity,
            SUM(CASE WHEN type = 'restock' THEN quantity ELSE 0 END) AS restk_quantity
        FROM 
            stock_adjustments 
        WHERE 
            DATE(transaction_date) = CURDATE() 
            AND product_id IS NOT NULL
        GROUP BY 
            product_id
    ) e ON e.product_id = pq.product_id 
    LEFT JOIN (
    SELECT 
	p.id AS product_id,
    SUM(oi.quantity) AS total_quantity
    FROM 
        orders o
        LEFT JOIN order_item oi ON o.id = oi.order_id
        LEFT JOIN product p ON oi.product_id = p.id
    WHERE 
        DATE(o.order_date) = curdate()
    GROUP BY p.id
    
    ) t on t.product_id = p.id
    WHERE 
      DATE(pq.log_date) = CURDATE() 
    GROUP BY 
      p.category_id, 
      c.name, 
      p.product_name, 
      pq.start_quantity, 
      pq.end_quantity, 
      p.product_quantity,
      e.dmg_quantity, 
	  e.restk_quantity,
      t.total_quantity
    ORDER BY 
      p.category_id`,
      callback
    );
  }

  getPackagingReports(callback) {
    db.query(
      `SELECT 
      p.name, 
      pq.start_quantity, 
      COALESCE(e.dmg_quantity, 0) AS damaged, 
      COALESCE(e.restk_quantity, 0) AS restock,  
      t.total_quantity AS releasing,
      p.quantity AS end_quantity
      FROM 
          packaging_quantity_log pq 
      LEFT JOIN 
          packaging p ON p.id = pq.packaging_id 
      LEFT JOIN 
          (
              SELECT 
                  packaging_id, 
                  SUM(CASE WHEN type = 'damaged' THEN quantity ELSE 0 END) AS dmg_quantity,
                  SUM(CASE WHEN type = 'restock' THEN quantity ELSE 0 END) AS restk_quantity
              FROM 
                  stock_adjustments 
              WHERE 
                  DATE(transaction_date) = CURDATE()
              GROUP BY 
                  packaging_id
          ) e ON e.packaging_id = pq.packaging_id  
          
		LEFT JOIN (
        SELECT 
	p.id AS packaging_id,
    SUM(oi.quantity) AS total_quantity
    FROM 
        orders o
        LEFT JOIN order_item oi ON o.id = oi.order_id
        LEFT JOIN packaging p ON oi.packaging_id = p.id
    WHERE 
        DATE(o.order_date) = curdate()
    GROUP BY p.id
        ) t ON t.packaging_id = p.id
      WHERE 
          DATE(pq.log_date) = CURDATE() 
      GROUP BY 
          p.name, pq.start_quantity, pq.end_quantity, p.quantity, e.dmg_quantity, e.restk_quantity, t.total_quantity`,
      callback
    );
  }
}

module.exports = new OrderModel();
