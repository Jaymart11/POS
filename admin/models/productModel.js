// models/productModel.js

const db = require("../database.js");

class ProductModel {
  getAllProducts(categoryId, callback) {
    let query =
      "SELECT p.id, p.code, p.product_name, p.product_quantity, p.price, p.date_created, p.created_by, p.updated_by, p.created_at, p.updated_at, p.category_id, p.deleted_by, p.deleted_at,pk.id as packaging_id, pk.name as packaging_name, pk.quantity FROM product p LEFT JOIN product_packaging pp ON p.id = pp.product_id LEFT JOIN packaging pk ON pk.id = pp.packaging_id";
    if (categoryId) {
      query += " WHERE p.category_id = ? AND p.deleted_by IS NULL";
    } else {
      query += " WHERE p.deleted_by IS NULL";
    }

    query += " ORDER BY p.category_id";
    db.query(query, [categoryId], callback);
  }

  getProductById(productId, callback) {
    db.query("SELECT * FROM product WHERE id = ?", [productId], callback);
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

        // Execute all insertions in parallel
        Promise.all(productPackaging)
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
    const { packaging, ...productDetails } = productData;

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

            // Flatten the result to an array of packaging IDs
            const existingPackagingIds = existingPackaging.map(
              (row) => row.packaging_id
            );

            // Compare existing packaging with the new packaging
            const packagingUnchanged =
              packaging.length === existingPackagingIds.length &&
              packaging.every((id) => existingPackagingIds.includes(id));

            if (packagingUnchanged) {
              // If packaging is unchanged, just return the success callback
              return callback(null, result);
            }

            // Step 3: Delete existing packaging for the product (if packaging has changed)
            db.query(
              "DELETE FROM product_packaging WHERE product_id = ?",
              [productId],
              (err, result) => {
                if (err) {
                  return callback(err); // Stop if deleting packaging fails
                }

                // Log the deletion of old packaging
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
                  }
                );

                // Step 4: Insert new packaging data into 'product_packaging'
                const packagingValues = packaging.map((packagingId) => [
                  productId,
                  packagingId,
                ]);

                if (packagingValues.length > 0) {
                  db.query(
                    "INSERT INTO product_packaging (product_id, packaging_id) VALUES ?",
                    [packagingValues],
                    (err, result) => {
                      if (err) {
                        return callback(err); // Stop if inserting packaging fails
                      }

                      return callback(null, result); // Success
                    }
                  );
                } else {
                  // No packaging data to insert, return success
                  return callback(null, result);
                }
              }
            );
          }
        );
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
