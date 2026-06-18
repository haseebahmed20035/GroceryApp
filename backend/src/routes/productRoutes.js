const express = require("express");
const db = require("../config/db");

const router = express.Router();

function productSelect() {
  return `
    SELECT 
      p.id,
      p.name,
      p.category_id,
      c.name AS category,
      p.price,
      p.old_price AS oldPrice,
      p.off_amount AS off,
      p.image,
      p.brand,
      p.unit,
      p.stock,
      p.delivery,
      p.description,
      p.promotion,
      p.special,
      p.trending
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `;
}

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`${productSelect()} ORDER BY p.id DESC`);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/promotions", async (req, res) => {
  const [rows] = await db.query(`${productSelect()} WHERE p.promotion = true`);
  res.json({ success: true, data: rows });
});

router.get("/special-offers", async (req, res) => {
  const [rows] = await db.query(`${productSelect()} WHERE p.special = true`);
  res.json({ success: true, data: rows });
});

router.get("/trending", async (req, res) => {
  const [rows] = await db.query(`${productSelect()} WHERE p.trending = true`);
  res.json({ success: true, data: rows });
});

router.get("/category/:categoryId", async (req, res) => {
  const [rows] = await db.query(
    `${productSelect()} WHERE p.category_id = ?`,
    [req.params.categoryId]
  );

  res.json({ success: true, data: rows });
});

router.get("/:id", async (req, res) => {
  const [rows] = await db.query(
    `${productSelect()} WHERE p.id = ?`,
    [req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  res.json({ success: true, data: rows[0] });
});

module.exports = router;