const expenseModel = require("../models/expenseModel");
const orderModel = require("../models/orderModel");
const ExcelJS = require("exceljs");

exports.getAllOrders = (req, res) => {
  orderModel.getAllOrders((err, orders) => {
    if (err) {
      console.error(err);
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
      console.error(err);
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
      console.error(err);
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
      console.error(err);
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
      console.error(err);
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
  const worksheet = workbook.addWorksheet("Orders");

  worksheet.columns = [
    { header: "ITEMS", key: "product_name", width: 20 },
    { header: "PRICE", key: "price" },
    { header: "SOLD", key: "total_quantity" },
    { header: "SALES AMOUNT", key: "total_sales", width: 20 },
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, size: 14 }; // Bold, size 14, white font
  headerRow.height = 30;
  headerRow.alignment = { vertical: "middle", horizontal: "center" };

  orderModel.getReports((err, result) => {
    if (err) {
      console.error(err);
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
        price: row.price,
        total_quantity: row.total_quantity,
        total_sales: row.total_sales,
      });

      productRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = {
          size: 12,
        };
      });
      grossSales += row.total_sales;
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

    expenseModel.getTotalExpenses((err, TEresult) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error fetching data");
        return;
      }

      // Ensure OPresult is an array of expense objects

      let expenseTotal = 0;

      TEresult.forEach((expense, index) => {
        console.log(`Expense ${index}: `, expense); // Debug logging
        if (index === 0) {
          worksheet.addRow(["Expense", expense.name, expense.amount]);
          expenseTotal += expense.amount;
        } else {
          worksheet.addRow(["", expense.name, expense.amount]);
          expenseTotal += expense.amount;
        }
      });

      worksheet.addRow(["", "Total", "", expenseTotal]);

      expenseModel.getOnlinePayment((err, OPresult) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error fetching data");
          return;
        }

        let opTotal = 0;
        // Ensure OPresult is an array of expense objects
        OPresult.forEach((online, index) => {
          console.log(`Expense ${index}: `, online); // Debug logging
          worksheet.addRow([online.name, "", "", online.total_price]);
          opTotal += online.total_price;
        });

        net = worksheet.addRow([
          "NET SALES",
          "",
          "",
          grossSales - expenseTotal - opTotal,
        ]);

        net.font = {
          bold: true,
          size: 18,
        };

        worksheet.mergeCells(`A${net.number}:C${net.number}`);

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
            console.error(error);
            res.status(500).send("Error exporting data to Excel");
          });
      });
    });
  });
};
