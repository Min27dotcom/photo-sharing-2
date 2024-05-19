const express = require("express");
const Users = require("../db/userModel");
const jwt = require('jsonwebtoken');
const router = express.Router();
const fs = require('fs');
const verifyToken = require("../helpers/verifyToken");
const { log } = require("util");
const privateKey = fs.readFileSync('private.key');

//dang nhap
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Users.find({ username, password });
    if (user.length == 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ user }, privateKey, { expiresIn: "1h" });
    const { first_name, last_name, _id } = user[0];
    res.json({ token, user: { first_name, last_name, _id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//dang xuat
router.post("/logout", verifyToken, async (req, res) => {
  res.json({ message: 'Logged out successfully'});
});

module.exports = router;
