// controllers/userController.js

const userModel = require("../models/userModel");

exports.getAllUsers = (req, res) => {
  userModel.getAllUsers((err, users) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(users);
  });
};

exports.getAllCashier = (req, res) => {
  userModel.getAllCashier((err, users) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(users);
  });
};

exports.getUserById = (req, res) => {
  const userId = req.params.id;
  userModel.getUserById(userId, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  });
};

exports.createUser = (req, res) => {
  const user = req.body;
  userModel.createUser(user, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res
      .status(201)
      .json({ message: "User created successfully", id: result.insertId });
  });
};

exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  userModel.updateUser(userId, userData, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ message: "User updated successfully" });
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  userModel.deleteUser(userId, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ message: "User deleted successfully" });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  userModel.getUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    const user = results[0];

    if (results.length === 0 || password !== user.password)
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        access_level: user.access_level_id,
      },
    });
  });
};
