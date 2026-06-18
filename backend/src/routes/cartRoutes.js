const express = require("express");
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

async function getOrCreateCart(userId) {
  const [carts] = await db.query("SELECT id FROM carts WHERE user_id = ?", [userId]);

  if (carts.length > 0) return carts[0].id;

  const [result] = await db.query("INSERT INTO carts (user_id) VALUES (?)", [userId]);
  return result.insertId;
}

router.get("/", auth, async (req, res) => {
  try {
    const cartId = await getOrCreateCart(req.user.id);

    const [items] = await db.query(
      `
      SELECT 
        ci.id AS cartItemId,
        ci.quantity,
        p.id,
        p.name,
        p.price,
        p.old_price AS oldPrice,
        p.off_amount AS off,
        p.image,
        p.brand,
        p.unit,
        c.name AS category,
        (ci.quantity * p.price) AS total
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ci.cart_id = ?
      `,
      [cartId]
    );

    const totalAmount = items.reduce((sum, item) => sum + Number(item.total), 0);

    res.json({ success: true, data: items, totalAmount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/add", auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const cartId = await getOrCreateCart(req.user.id);

    const [existing] = await db.query(
      "SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?",
      [cartId, productId]
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
        [quantity, existing[0].id]
      );
    } else {
      await db.query(
        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)",
        [cartId, productId, quantity]
      );
    }

    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/update", auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cartId = await getOrCreateCart(req.user.id);

    if (quantity <= 0) {
      await db.query(
        "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?",
        [cartId, productId]
      );
    } else {
      await db.query(
        "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?",
        [quantity, cartId, productId]
      );
    }

    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/remove/:productId", auth, async (req, res) => {
  try {
    const cartId = await getOrCreateCart(req.user.id);

    await db.query(
      "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?",
      [cartId, req.params.productId]
    );

    res.json({ success: true, message: "Product removed from cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/clear", auth, async (req, res) => {
  try {
    const cartId = await getOrCreateCart(req.user.id);
    await db.query("DELETE FROM cart_items WHERE cart_id = ?", [cartId]);

    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;