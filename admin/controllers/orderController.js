const expenseModel = require("../models/expenseModel");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");
const ExcelJS = require("exceljs");
const dayjs = require("dayjs");
const userModel = require("../models/userModel");

exports.getAllOrders = (req, res) => {
  orderModel.getAllOrders((err, orders) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(orders);
  });
};

exports.getOrderById = (req, res) => {
  const orderId = req.params.id;
  orderModel.getOrderById(orderId, (err, order) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(order);
  });
};

exports.createOrder = (req, res) => {
  const { orderData, items } = req.body;
  orderModel.createOrder(orderData, items, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res
      .status(201)
      .json({ message: "Order created successfully", id: result.insertId });
  });
};

exports.updateOrder = (req, res) => {
  const orderId = req.params.id;
  const { orderData, items } = req.body;
  orderModel.updateOrder(orderId, orderData, items, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json({ message: "Order updated successfully" });
  });
};

exports.deleteOrder = (req, res) => {
  const orderId = req.params.id;
  orderModel.deleteOrder(orderId, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json({ message: "Order deleted successfully" });
  });
};

exports.exportReport = (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sales");
  const worksheet2 = workbook.addWorksheet("Stocks");

  userModel.getUserById(req.body.user_id, (err, emp) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching data");
      return;
    }
    worksheet.addRow([""]);

    report = worksheet.addRow(["Sales Report"]);

    report.font = {
      bold: true,
      size: 18,
    };

    worksheet.addRow([""]);

    employee = worksheet.addRow([
      "Employee:",
      emp.length !== 0 ? `${emp[0].first_name} ${emp[0].last_name}` : "All",
    ]);

    employee.font = {
      bold: true,
      size: 13,
    };

    date = worksheet.addRow([
      "Date:",
      dayjs(req.body.date[0]).format("MMMM DD, YYYY") ==
      dayjs(req.body.date[1]).format("MMMM DD, YYYY")
        ? dayjs(req.body.date[0]).format("MMMM DD, YYYY")
        : `${dayjs(req.body.date[0]).format("MMMM DD, YYYY")} - ${dayjs(
            req.body.date[1]
          ).format("MMMM DD, YYYY")}`,
    ]);

    date.font = {
      bold: true,
      size: 13,
    };

    worksheet2.addRow([""]);

    report2 = worksheet2.addRow(["Inventory Report"]);

    report2.font = {
      bold: true,
      size: 18,
    };

    worksheet2.addRow([""]);

    employee2 = worksheet2.addRow([
      "Employee:",
      emp.length !== 0 ? `${emp[0].first_name} ${emp[0].last_name}` : "All",
    ]);

    employee2.font = {
      bold: true,
      size: 13,
    };

    date2 = worksheet2.addRow([
      "Date:",
      dayjs(req.body.date[0]).format("MMMM DD, YYYY") ==
      dayjs(req.body.date[1]).format("MMMM DD, YYYY")
        ? dayjs(req.body.date[0]).format("MMMM DD, YYYY")
        : `${dayjs(req.body.date[0]).format("MMMM DD, YYYY")} - ${dayjs(
            req.body.date[1]
          ).format("MMMM DD, YYYY")}`,
    ]);

    date2.font = {
      bold: true,
      size: 13,
    };

    worksheet.getRow(7).values = ["ITEMS", "PRICE", "SOLD", "SALES AMOUNT"];
    worksheet2.getRow(7).values = [
      "ITEMS",
      "STARTING",
      "RESTOCKED",
      "DAMAGED",
      "RELEASING",
      "ENDING",
    ];

    worksheet.columns = [
      { key: "product_name", width: 20 },
      { key: "price" },
      { key: "total_quantity" },
      { key: "total_sales", width: 20 },
    ];
    worksheet2.columns = [
      { key: "product_name", width: 20 },
      { key: "start_quantity", width: 20 },
      { key: "restock", width: 20 },
      { key: "damaged", width: 20 },
      { key: "releasing", width: 20 },
      { key: "end_quantity", width: 20 },
    ];
    const headerRow = worksheet.getRow(7);
    headerRow.font = { bold: true, size: 14 }; // Bold, size 14, white font
    headerRow.height = 30;
    headerRow.alignment = { vertical: "middle", horizontal: "center" };

    const headerRow2 = worksheet2.getRow(7);
    headerRow2.font = { bold: true, size: 14 }; // Bold, size 14, white font
    headerRow2.height = 30;
    headerRow2.alignment = { vertical: "middle", horizontal: "center" };

    productModel.getAllProducts("", (err, prodresult) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error fetching data");
        return;
      }

      orderModel.getTotalDiscount(req.body, (err, discountRes) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error fetching data");
          return;
        }

        const discount = parseInt(discountRes[0].discount || 0);

        orderModel.getReports(req.body, (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error fetching data");
            return;
          }

          let lastCategory = null;
          let grossSales = 0;

          // Add rows
          result.forEach((row) => {
            if (row.category_name !== lastCategory) {
              categoryRow = worksheet.addRow({
                product_name: row.category_name,
                price: "",
                total_quantity: "",
                total_sales: "",
              });
              lastCategory = row.category_name;
              categoryRow.getCell(1).font = {
                bold: true,
                size: 13,
              };
              categoryRow.eachCell({ includeEmpty: true }, (cell) => {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "fffff2cc" },
                }; // Light green background
              });
            }
            productRow = worksheet.addRow({
              product_name: row.product_name,
              price: parseInt(row.price),
              total_quantity: parseInt(row.total_quantity),
              total_sales: parseInt(row.total_sales),
            });

            productRow.eachCell({ includeEmpty: true }, (cell) => {
              cell.font = {
                size: 12,
              };
            });
            grossSales += parseInt(row.total_sales);
          });

          gross = worksheet.addRow({
            product_name: "GROSS SALES",
            price: "",
            total_quantity: "",
            total_sales: grossSales,
          });
          gross.font = {
            bold: true,
            size: 18,
          };

          worksheet.mergeCells(`A${gross.number}:C${gross.number}`);

          worksheet.addRow([""]);
          worksheet.addRow(["Gross Sales", "", "", grossSales]);
          worksheet.addRow(["Discounts", "", "", discount]);

          expenseModel.getTotalExpenses(req.body, (err, TEresult) => {
            if (err) {
              console.log(err);
              res.status(500).send("Error fetching data");
              return;
            }

            // Ensure OPresult is an array of expense objects

            let expenseTotal = 0;

            TEresult.forEach((expense, index) => {
              if (index === 0) {
                worksheet.addRow([
                  "Expenses",
                  expense.name,
                  parseInt(expense.amount),
                ]);
                expenseTotal += parseInt(expense.amount);
              } else {
                worksheet.addRow(["", expense.name, parseInt(expense.amount)]);
                expenseTotal += parseInt(expense.amount);
              }
            });

            if (TEresult.length)
              worksheet.addRow(["", "Total", "", expenseTotal]);

            expenseModel.getOnlinePayment(req.body, (err, OPresult) => {
              if (err) {
                console.log(err);
                res.status(500).send("Error fetching data");
                return;
              }

              let opTotal = 0;
              // Ensure OPresult is an array of expense objects
              OPresult.forEach((online, index) => {
                worksheet.addRow([
                  online.name,
                  "",
                  "",
                  parseInt(online.total_price),
                ]);
                opTotal += parseInt(online.total_price);
              });

              net = worksheet.addRow([
                "NET SALES",
                "",
                "",
                grossSales - expenseTotal - opTotal - discount,
              ]);

              net.font = {
                bold: true,
                size: 18,
              };

              worksheet.mergeCells(`A${net.number}:C${net.number}`);

              orderModel.getStocksReports(req.body, (err, stockResult) => {
                if (err) {
                  console.log(err);
                  res.status(500).send("Error fetching data");
                  return;
                }

                let lastCategory1 = null;

                // Add rows
                stockResult.forEach((row) => {
                  if (row.category_name !== lastCategory1) {
                    categoryRow1 = worksheet2.addRow({
                      product_name: row.category_name,
                      start_quantity: "",
                      end_quantity: "",
                      releasing: "",
                    });
                    lastCategory1 = row.category_name;
                    categoryRow1.getCell(1).font = {
                      bold: true,
                      size: 13,
                    };
                    categoryRow1.eachCell({ includeEmpty: true }, (cell) => {
                      cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "fffff2cc" },
                      }; // Light green background
                    });
                  }
                  productRow1 = worksheet2.addRow({
                    product_name: row.product_name,
                    start_quantity: row.starting,
                    restock: parseInt(row.restock),
                    damaged: parseInt(row.damaged),
                    releasing: parseInt(row.releasing),
                    end_quantity: row.ending,
                  });

                  productRow1.eachCell({ includeEmpty: true }, (cell) => {
                    cell.font = {
                      size: 12,
                    };
                  });
                });

                worksheet2.addRow([""]);
                worksheet2.addRow([""]);

                testonly = worksheet2.addRow([
                  "BOXES",
                  "STARTING",
                  "RESTOCKED",
                  "DAMAGED",
                  "RELEASING",
                  "ENDING",
                ]);

                testonly.font = { bold: true, size: 14 }; // Bold, size 14, white font
                testonly.height = 30;
                testonly.alignment = {
                  vertical: "middle",
                  horizontal: "center",
                };

                orderModel.getPackagingReports(req.body, (err, pResult) => {
                  if (err) {
                    console.log(err);
                    res.status(500).send("Error fetching data");
                    return;
                  }

                  pResult.forEach((row) => {
                    productRow2 = worksheet2.addRow({
                      product_name: row.name,
                      start_quantity: row.start_quantity,
                      restock: parseInt(row.restock),
                      damaged: parseInt(row.damaged),
                      releasing: parseInt(row.releasing),
                      end_quantity: row.end_quantity,
                    });

                    productRow2.eachCell({ includeEmpty: true }, (cell) => {
                      cell.font = {
                        size: 12,
                      };
                    });
                  });

                  res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  );
                  res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=exported-data.xlsx"
                  );

                  // Stream the Excel workbook to the response
                  workbook.xlsx
                    .write(res)
                    .then(() => {
                      res.end();
                    })
                    .catch((error) => {
                      console.log(error);
                      res.status(500).send("Error exporting data to Excel");
                    });
                });
              });
            });
          });
        });
      });
    });
  });
};
