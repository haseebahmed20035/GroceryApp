const express = require("express");
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { name, phone, address, paymentMethod = "Cash on Delivery" } = req.body;

    const [cartRows] = await connection.query(
      "SELECT id FROM carts WHERE user_id = ?",
      [req.user.id]
    );

    if (cartRows.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const cartId = cartRows[0].id;

    const [items] = await connection.query(
      `
      SELECT ci.product_id, ci.quantity, p.price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
      `,
      [cartId]
    );

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const [orderResult] = await connection.query(
      `
      INSERT INTO orders 
      (user_id, total_amount, name, phone, address, payment_method)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [req.user.id, totalAmount, name, phone, address, paymentMethod]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await connection.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
        `,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    await connection.query("DELETE FROM cart_items WHERE cart_id = ?", [cartId]);

    await connection.commit();

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId,
      totalAmount,
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
});

router.get("/my-orders", auth, async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC",
      [req.user.id]
    );

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const [items] = await db.query(
      `
      SELECT 
        oi.quantity,
        oi.price,
        p.id,
        p.name,
        p.image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
      `,
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...orders[0],
        items,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;