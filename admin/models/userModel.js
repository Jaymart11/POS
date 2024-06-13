// models/userModel.js

const db = require("../database");

class UserModel {
  getAllUsers(callback) {
    db.query(
      "select u.id, u.first_name,u.email, u.password, u.last_name, u.access_level_id, a.name from user as u left join access_level as a on  u.access_level_id = a.id",
      callback
    );
  }

  getUserById(userId, callback) {
    db.query("SELECT * FROM user WHERE id = ?", [userId], callback);
  }

  createUser(user, callback) {
    db.query("INSERT INTO user SET ?", user, callback);
  }

  updateUser(userId, userData, callback) {
    db.query("UPDATE user SET ? WHERE id = ?", [userData, userId], callback);
  }

  deleteUser(userId, callback) {
    db.query("DELETE FROM user WHERE id = ?", [userId], callback);
  }

  getUserByEmail(email, callback) {
    db.query("SELECT * FROM user WHERE email = ?", [email], callback);
  }
}

module.exports = new UserModel();
