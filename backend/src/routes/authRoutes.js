const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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

    if (!user.password) {
  return res.status(401).json({
    success: false,
    message: "Please login with Google",
  });
}

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

router.post("/google-login", async (req, res) => {
  try {
    const { idToken, role } = req.body;

const allowedRoles = ['customer', 'seller'];
const userRole = allowedRoles.includes(role) ? role : 'customer';

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const google_id = payload.sub;
    const email = payload.email;
    const name = payload.name;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? OR google_id = ?",
      [email, google_id]
    );

    let user;

    if (users.length > 0) {
      user = users[0];

      if (!user.google_id) {
        await db.query(
          "UPDATE users SET google_id = ? WHERE id = ?",
          [google_id, user.id]
        );
      }
    } else {
      const [result] = await db.query(
        `INSERT INTO users
        (name, email, google_id, role)
        VALUES (?, ?, ?, ?)`,
        [name, email, google_id, userRole]
      );

      user = {
        id: result.insertId,
        name,
        email,
        google_id,
        role: userRole,
      };
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    delete user.password;

    res.json({
      success: true,
      message: "Google login successful",
      token,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Google login failed",
    });
  }
});

module.exports = router;