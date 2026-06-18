const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password required" });
    }

    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, phone || null, address || null]
    );

    res.json({
      success: true,
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    delete user.password;

    res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;