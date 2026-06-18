const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories ORDER BY id ASC");
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM categories WHERE id = ?", [
    req.params.id,
  ]);

  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  res.json({ success: true, data: rows[0] });
});

module.exports = router;