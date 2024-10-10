const db = require("../database");

class OrderModel {
  getAllOrders(callback) {
    db.query(
      `SELECT o.id,o.total_price,o.total_items,o.discount, o.amount, ot.name AS order_type, CONCAT(u.first_name, ' ', u.last_name) AS employee, pm.name AS payment_method, s.name as status, o.order_date  FROM orders o LEFT JOIN order_type ot ON o.order_type_id = ot.id LEFT JOIN user u ON o.user_id = u.id LEFT JOIN payment_method pm ON o.payment_method_id = pm.id LEFT JOIN status s ON o.status_id = s.id ORDER BY o.order_date DESC`,
      callback
    );
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
      "SELECT order_id, product_id, packaging_id, quantity FROM order_item WHERE order_id = ?",
      [orderId],
      (err, orderResult) => {
        if (err) return callback(err);
        console.log(orderResult.length);
        function updateProductAndPackaging(index) {
          if (index >= orderResult.length) {
            db.query(
              "DELETE FROM order_item WHERE order_id = ?",
              [orderId],
              (err, result) => {
                if (err) return callback(err);
                db.query(
                  "DELETE FROM orders WHERE id = ?",
                  [orderId],
                  callback
                );
              }
            );
            return;
          }

          const orderItem = orderResult[index];
          db.query(
            "UPDATE product SET product_quantity = product_quantity + ? WHERE id = ?",
            [orderItem.quantity, orderItem.product_id],
            (err) => {
              if (err) return callback(err);

              db.query(
                "UPDATE packaging SET quantity = quantity + ? WHERE id = ?",
                [orderItem.quantity, orderItem.packaging_id],
                (err) => {
                  if (err) return callback(err);

                  updateProductAndPackaging(index + 1);
                }
              );
            }
          );
        }

        updateProductAndPackaging(0);
      }
    );
  }

  getTotalDiscount({ date, user_id }, callback) {
    db.query(
      `SELECT SUM(discount) as discount from orders WHERE order_date BETWEEN '${
        date[0]
      }' AND '${date[1]}' ${user_id !== 0 ? "AND user_id =" + user_id : ""}`,
      callback
    );
  }

  getReports({ date, user_id }, callback) {
    db.query(
      `SELECT 
    c.id AS category_id,
    c.name AS category_name,
    p.id AS product_id,
    p.product_name,
    COALESCE(oi.price_at_order, 0) AS price,
    CASE 
      WHEN oi.price_at_order is null THEN COALESCE(p.price, 0)
      ELSE oi.price_at_order
    END AS price,
    COALESCE(SUM(oi.quantity * oi.price_at_order), 0) AS total_sales,
    COALESCE(SUM(oi.quantity), 0) AS total_quantity
    FROM 
        product p
        LEFT JOIN category c ON c.id = p.category_id
        LEFT JOIN (
            SELECT 
                oi.product_id, 
                oi.price_at_order, 
                oi.quantity 
            FROM 
                order_item oi 
                INNER JOIN orders o ON oi.order_id = o.id 
            WHERE 
                o.order_date BETWEEN '${date[0]}' AND '${date[1]}' ${
        user_id !== 0 ? "AND o.user_id =" + user_id : ""
      }
        ) oi ON p.id = oi.product_id
    WHERE p.deleted_by is null
    GROUP BY 
        c.id, c.name, p.id, p.product_name, oi.price_at_order
    ORDER BY 
        c.id, p.product_name`,
      callback
    );
  }

  getStocksReports({ date, user_id }, callback) {
    db.query(
      `WITH MinDates AS (
        SELECT
            n.category_id, 
            c.name AS category_name, 
            l.product_id,
            l.log_date,
            n.product_name,
            COALESCE(l.start_quantity, 0) AS quantity,
            ROW_NUMBER() OVER (PARTITION BY l.product_id ORDER BY l.log_date ASC) AS rn
        FROM
            product_quantity_log l
        LEFT JOIN
            product n ON l.product_id = n.id
      LEFT JOIN 
            category c ON c.id = n.category_id 
        WHERE
            DATE(l.log_date) BETWEEN DATE('${date[0]}') AND DATE('${
        date[1]
      }') AND n.deleted_by IS NULL
    ),
    MaxDates AS (
        SELECT
        n.category_id, 
            c.name AS category_name, 
            l.product_id,
            l.log_date,
            n.product_name,
            COALESCE(l.end_quantity, 0) AS quantity,
            ROW_NUMBER() OVER (PARTITION BY l.product_id ORDER BY l.log_date DESC) AS rn
        FROM
            product_quantity_log l
        LEFT JOIN
            product n ON l.product_id = n.id
        LEFT JOIN 
            category c ON c.id = n.category_id 
        WHERE
            DATE(l.log_date) BETWEEN DATE('${date[0]}') AND DATE('${
        date[1]
      }') AND n.deleted_by IS NULL
    ),
    StartEndQuantities AS (
        SELECT
            min_log.category_id, 
            min_log.category_name, 
            min_log.product_id,
            min_log.log_date AS start_log_date,
            min_log.product_name AS start_name,
            min_log.quantity AS start_quantity,
            max_log.log_date AS end_log_date,
            max_log.product_name AS end_name,
            max_log.quantity AS end_quantity
        FROM
            (SELECT * FROM MinDates WHERE rn = 1) AS min_log
        JOIN
            (SELECT * FROM MaxDates WHERE rn = 1) AS max_log
        ON
            min_log.product_id = max_log.product_id
    ),
    OrderQuantities AS (
        SELECT 
            p.id AS product_id,
            COALESCE(SUM(oi.quantity), 0) AS total_quantity
        FROM 
            orders o
        LEFT JOIN 
            order_item oi ON o.id = oi.order_id
        LEFT JOIN 
            product p ON oi.product_id = p.id
        WHERE 
            o.order_date BETWEEN '${date[0]}' AND '${date[1]}' ${
        user_id !== 0 ? "AND o.user_id = " + user_id : ""
      }
        GROUP BY 
            p.id
    ),
    StockAdjustments AS (
        SELECT 
            product_id, 
            COALESCE(SUM(CASE WHEN type = 'damaged' THEN quantity ELSE 0 END), 0) AS dmg_quantity,
            COALESCE(SUM(CASE WHEN type = 'restock' THEN quantity ELSE 0 END), 0) AS restk_quantity
        FROM 
            stock_adjustments 
        WHERE 
            transaction_date BETWEEN '${date[0]}' AND '${date[1]}' ${
        user_id !== 0 ? "AND created_by = " + user_id : ""
      }
        GROUP BY 
            product_id
    ),    
  OrderQuantitiesBefore AS (
      SELECT
          p.id AS product_id,
          COALESCE(SUM(oi.quantity), 0) AS total_quantity
      FROM
          orders o
      LEFT JOIN
          order_item oi ON o.id = oi.order_id
      LEFT JOIN
          product p ON oi.product_id = p.id
      WHERE
        o.order_date BETWEEN DATE('${date[1]}') AND '${date[0]}'
      GROUP BY
          p.id
  ),
  StockAdjustmentsBefore AS (
      SELECT
          product_id,
          COALESCE(SUM(CASE WHEN type = 'damaged' THEN quantity ELSE 0 END), 0) AS dmg_quantity,
          COALESCE(SUM(CASE WHEN type = 'restock' THEN quantity ELSE 0 END), 0) AS restk_quantity
      FROM
          stock_adjustments
      WHERE
        transaction_date BETWEEN DATE('${date[1]}') AND '${date[0]}'
      GROUP BY
          product_id
  ),
  StartQuantity AS (
		SELECT
		  seq.category_id,
          seq.product_id,
		  (seq.start_quantity + COALESCE(sab.restk_quantity, 0)) - COALESCE(sab.dmg_quantity, 0) - COALESCE(oqb.total_quantity, 0) AS startingBefore
	  FROM
		  StartEndQuantities seq
	  LEFT JOIN
		  OrderQuantitiesBefore oqb ON seq.product_id = oqb.product_id
	  LEFT JOIN
		  StockAdjustmentsBefore sab ON sab.product_id = seq.product_id
	  ORDER BY
		  seq.category_id
  )
    SELECT
        seq.category_id,
        seq.category_name,
        seq.start_name as product_name,
        sq.startingBefore as 'starting',
        COALESCE(sa.dmg_quantity, 0) AS damaged,
        COALESCE(sa.restk_quantity, 0) AS restock,
        COALESCE(oq.total_quantity, 0) AS releasing,
        (sq.startingBefore + COALESCE(sa.restk_quantity, 0)) - COALESCE(sa.dmg_quantity, 0) - COALESCE(oq.total_quantity, 0) AS ending
        
    FROM
        StartEndQuantities seq
    LEFT JOIN
        OrderQuantities oq ON seq.product_id = oq.product_id
    LEFT JOIN
        StockAdjustments sa ON sa.product_id = seq.product_id
    LEFT JOIN
        StartQuantity sq ON sq.product_id = seq.product_id
    ORDER BY
      seq.category_id`,
      callback
    );
  }

  getPackagingReports({ date }, callback) {
    db.query(
      `WITH MinDates AS (
        SELECT
            l.packaging_id,
            l.log_date,
            n.name,
            COALESCE(l.start_quantity, 0) AS quantity,
            ROW_NUMBER() OVER (PARTITION BY l.packaging_id ORDER BY l.log_date ASC) AS rn
        FROM
            packaging_quantity_log l
        LEFT JOIN
            packaging n ON l.packaging_id = n.id
        WHERE
            DATE(l.log_date) BETWEEN DATE('${date[0]}') AND DATE('${date[1]}') AND n.deleted_by IS NULL
    ),
    MaxDates AS (
        SELECT
            l.packaging_id,
            l.log_date,
            n.name,
            COALESCE(l.end_quantity, 0) AS quantity,
            ROW_NUMBER() OVER (PARTITION BY l.packaging_id ORDER BY l.log_date DESC) AS rn
        FROM
            packaging_quantity_log l
        LEFT JOIN
            packaging n ON l.packaging_id = n.id
        WHERE
            DATE(l.log_date) BETWEEN DATE('${date[0]}') AND DATE('${date[1]}') AND n.deleted_by IS NULL
    ),
    StartEndQuantities AS (
        SELECT
            min_log.packaging_id,
            min_log.log_date AS start_log_date,
            min_log.name AS start_name,
            min_log.quantity AS start_quantity,
            max_log.log_date AS end_log_date,
            max_log.name AS end_name,
            max_log.quantity AS end_quantity
        FROM
            (SELECT * FROM MinDates WHERE rn = 1) AS min_log
        JOIN
            (SELECT * FROM MaxDates WHERE rn = 1) AS max_log
        ON
            min_log.packaging_id = max_log.packaging_id
    ),
    OrderQuantities AS (
        SELECT 
            p.id AS packaging_id,
            COALESCE(SUM(oi.quantity), 0) AS total_quantity
        FROM 
            orders o
        LEFT JOIN 
            order_item oi ON o.id = oi.order_id
        LEFT JOIN 
            packaging p ON oi.packaging_id = p.id
        WHERE 
            o.order_date BETWEEN '${date[0]}' AND '${date[1]}'
      }
        GROUP BY 
            p.id
    ),
    StockAdjustments AS (
        SELECT 
            packaging_id, 
            COALESCE(SUM(CASE WHEN type = 'damaged' THEN quantity ELSE 0 END), 0) AS dmg_quantity,
            COALESCE(SUM(CASE WHEN type = 'restock' THEN quantity ELSE 0 END), 0) AS restk_quantity
        FROM 
            stock_adjustments 
        WHERE 
            transaction_date BETWEEN '${date[0]}' AND '${date[1]}'
      }
        GROUP BY 
            packaging_id
    ),
    OrderQuantitiesBefore AS (
        SELECT 
            p.id AS packaging_id,
            COALESCE(SUM(oi.quantity), 0) AS total_quantity
        FROM 
            orders o
        LEFT JOIN 
            order_item oi ON o.id = oi.order_id
        LEFT JOIN 
            packaging p ON oi.packaging_id = p.id
        WHERE 
            o.order_date BETWEEN DATE('${date[1]}') AND '${date[0]}'
        GROUP BY 
            p.id
    ),
    StockAdjustmentsBefore AS (
        SELECT 
            packaging_id, 
            COALESCE(SUM(CASE WHEN type = 'damaged' THEN quantity ELSE 0 END), 0) AS dmg_quantity,
            COALESCE(SUM(CASE WHEN type = 'restock' THEN quantity ELSE 0 END), 0) AS restk_quantity
        FROM 
            stock_adjustments 
        WHERE 
            transaction_date BETWEEN DATE('${date[1]}') AND '${date[0]}'
        GROUP BY 
            packaging_id
    ),
    StartQuantity AS (
      SELECT
          seq.packaging_id,
          (seq.start_quantity + COALESCE(sab.restk_quantity, 0)) - COALESCE(sab.dmg_quantity, 0) - COALESCE(oqb.total_quantity, 0) AS starting_before
      FROM
          StartEndQuantities seq
      LEFT JOIN
          OrderQuantitiesBefore oqb ON seq.packaging_id = oqb.packaging_id
      LEFT JOIN 
          StockAdjustmentsBefore sab ON sab.packaging_id = seq.packaging_id
    )
    SELECT
        seq.start_name as name,
        sq.starting_before as start_quantity,
        COALESCE(sa.dmg_quantity, 0) AS damaged,
        COALESCE(sa.restk_quantity, 0) AS restock,
        COALESCE(oq.total_quantity, 0) AS releasing,
        (seq.start_quantity + COALESCE(sa.restk_quantity, 0)) - COALESCE(sa.dmg_quantity, 0) - COALESCE(oq.total_quantity, 0) AS end_quantity
    FROM
        StartEndQuantities seq
    LEFT JOIN
        OrderQuantities oq ON seq.packaging_id = oq.packaging_id
    LEFT JOIN 
        StockAdjustments sa ON sa.packaging_id = seq.packaging_id
    LEFT JOIN 
        StartQuantity sq ON sq.packaging_id = seq.packaging_id`,
      callback
    );
  }
}

module.exports = new OrderModel();
