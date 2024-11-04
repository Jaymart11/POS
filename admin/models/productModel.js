// models/productModel.js

const db = require("../database.js");
const dayjs = require("dayjs");

class ProductModel {
  getAllProducts(categoryId, callback) {
    let query =
      "SELECT p.id, p.code, p.product_name, p.product_quantity, p.price, p.date_created, p.created_by, p.updated_by, p.created_at, p.updated_at, p.category_id, p.deleted_by, p.deleted_at,pk.id as packaging_id, pk.name as packaging_name, pk.quantity, p.order_num, p.stock_notification, pk.stock_notification as packaging_stock_notification, pc.conversion_product_id, cp.product_name AS conversion_product_name, pc.conversion_ratio FROM product p LEFT JOIN product_conversion pc ON p.id = pc.product_id LEFT JOIN product_packaging pp ON p.id = pp.product_id LEFT JOIN packaging pk ON pk.id = pp.packaging_id LEFT JOIN product cp ON pc.conversion_product_id = cp.id";
    if (categoryId) {
      query += " WHERE p.category_id = ? AND p.deleted_by IS NULL ";
    } else {
      query += " WHERE p.deleted_by IS NULL";
    }

    query += " ORDER BY p.category_id, p.order_num";

    db.query(query, [categoryId], callback);
  }

  getProductById(productId, callback) {
    db.query(
      "SELECT * FROM product WHERE id = ? ORDER BY order_num",
      [productId],
      callback
    );
  }

  createProduct(
    {
      code,
      product_name,
      category_id,
      created_by,
      packaging,
      price,
      product_quantity,
      product_conversion, // Include conversion in the parameters
    },
    callback
  ) {
    // Insert product into the product table
    db.query(
      "INSERT INTO product SET ?",
      { code, product_name, category_id, created_by, price, product_quantity },
      (err, result) => {
        if (err) {
          return callback(err);
        }

        // Get the inserted product's ID
        const productId = result.insertId;

        db.query(`INSERT INTO product_quantity_log SET ?`, {
          product_id: productId,
          start_quantity: product_quantity,
          log_date: dayjs(new Date()).format("YYYY-MM-DD"),
        });

        // Loop through the packaging array and insert into product_packaging table
        const productPackaging = packaging.map((packageId) => {
          return new Promise((resolve, reject) => {
            db.query(
              "INSERT INTO product_packaging SET ?",
              { product_id: productId, packaging_id: packageId },
              (err, result) => {
                if (err) {
                  return reject(err);
                }

                resolve(result);
              }
            );
          });
        });

        // Loop through the conversion array and insert into product_conversion table
        const productConversions = product_conversion.map((conv) => {
          return new Promise((resolve, reject) => {
            db.query(
              "INSERT INTO product_conversion SET ?",
              {
                product_id: productId,
                conversion_product_id: conv.conversion_product_id,
                conversion_ratio: conv.conversion_ratio,
              },
              (err, result) => {
                if (err) {
                  return reject(err);
                }

                resolve(result);
              }
            );
          });
        });

        // Execute all insertions in parallel for packaging and conversions
        Promise.all([...productPackaging, ...productConversions])
          .then(() => {
            callback(null, productId); // All insertions succeeded
          })
          .catch((err) => {
            callback(err); // Handle errors
          });
      }
    );
  }

  updateProduct(productId, productData, callback) {
    const { packaging, product_conversion, ...productDetails } = productData;

    // Step 1: Update product details in the 'product' table
    db.query(
      "UPDATE product SET ? WHERE id = ?",
      [productDetails, productId],
      (err, result) => {
        if (err) {
          return callback(err); // Stop if product update fails
        }

        // Step 2: Retrieve the existing packaging data
        db.query(
          "SELECT packaging_id FROM product_packaging WHERE product_id = ?",
          [productId],
          (err, existingPackaging) => {
            if (err) {
              return callback(err); // Stop if fetching existing packaging fails
            }

            const existingPackagingIds = existingPackaging.map(
              (row) => row.packaging_id
            );

            const packagingUnchanged =
              packaging.length === existingPackagingIds.length &&
              packaging.every((id) => existingPackagingIds.includes(id));

            if (packagingUnchanged) {
              return updateConversions(); // Proceed to update conversions if packaging is unchanged
            }

            // Step 3: Delete existing packaging for the product (if packaging has changed)
            db.query(
              "DELETE FROM product_packaging WHERE product_id = ?",
              [productId],
              (err) => {
                if (err) {
                  return callback(err);
                }

                db.query(
                  "INSERT INTO product_packaging_log (product_id, packaging_id, performed_by) VALUES ?",
                  [
                    existingPackagingIds.map((packagingId) => [
                      productId,
                      packagingId,
                      productDetails.updated_by,
                    ]),
                  ],
                  (err) => {
                    if (err) {
                      console.error(
                        "Failed to log deletion of product packaging:",
                        err
                      );
                    }

                    const packagingValues = packaging.map((packagingId) => [
                      productId,
                      packagingId,
                    ]);

                    if (packagingValues.length > 0) {
                      db.query(
                        "INSERT INTO product_packaging (product_id, packaging_id) VALUES ?",
                        [packagingValues],
                        (err) => {
                          if (err) {
                            return callback(err);
                          }
                          updateConversions(); // Proceed to update conversions
                        }
                      );
                    } else {
                      updateConversions(); // No packaging data to insert, proceed to update conversions
                    }
                  }
                );
              }
            );
          }
        );

        // Function to handle updating conversions
        function updateConversions() {
          db.query(
            "SELECT conversion_product_id, conversion_ratio FROM product_conversion WHERE product_id = ?",
            [productId],
            (err, existingConversions) => {
              if (err) {
                return callback(err);
              }

              const existingConversionsMap = new Map(
                existingConversions.map((row) => [
                  row.conversion_product_id,
                  row.conversion_ratio,
                ])
              );

              const conversionsToDelete = [];
              const conversionsToUpdate = [];
              const conversionsToInsert = [];

              product_conversion.forEach((conv) => {
                const existingRatio = existingConversionsMap.get(
                  conv.conversion_product
                );

                if (existingRatio === undefined) {
                  conversionsToInsert.push(conv); // New conversion, insert
                } else if (existingRatio !== conv.conversion_ratio) {
                  conversionsToUpdate.push(conv); // Ratio changed, update
                }

                existingConversionsMap.delete(conv.conversion_product);
              });

              // Any remaining items in `existingConversionsMap` should be deleted
              existingConversionsMap.forEach((_, conversionProductId) => {
                conversionsToDelete.push(conversionProductId);
              });

              // Perform the deletions, insertions, and updates sequentially using callbacks
              if (conversionsToDelete.length) {
                db.query(
                  "DELETE FROM product_conversion WHERE product_id = ? AND conversion_product_id IN (?)",
                  [productId, conversionsToDelete],
                  (err) => {
                    if (err) return callback(err);
                    handleInsertsAndUpdates();
                  }
                );
              } else {
                handleInsertsAndUpdates();
              }

              function handleInsertsAndUpdates() {
                const insertQueries = conversionsToInsert.map(
                  (conv) =>
                    new Promise((resolve, reject) => {
                      db.query(
                        "INSERT INTO product_conversion (product_id, conversion_product_id, conversion_ratio) VALUES (?, ?, ?)",
                        [
                          productId,
                          conv.conversion_product_id,
                          conv.conversion_ratio,
                        ],
                        (err, result) => {
                          if (err) reject(err);
                          resolve(result);
                        }
                      );
                    })
                );

                const updateQueries = conversionsToUpdate.map(
                  (conv) =>
                    new Promise((resolve, reject) => {
                      db.query(
                        "UPDATE product_conversion SET conversion_ratio = ? WHERE product_id = ? AND conversion_product_id = ?",
                        [
                          conv.conversion_ratio,
                          productId,
                          conv.conversion_product_id,
                        ],
                        (err, result) => {
                          if (err) reject(err);
                          resolve(result);
                        }
                      );
                    })
                );

                Promise.all([...insertQueries, ...updateQueries])
                  .then(() => callback(null, result))
                  .catch((err) => callback(err));
              }
            }
          );
        }
      }
    );
  }

  deleteProduct(productId, productData, callback) {
    db.query(
      "UPDATE product SET ? WHERE id = ?",
      [productData, productId],
      callback
    );
  }
}

module.exports = new ProductModel();
