const { pool } = require('../db/pool');
const { sendOrderConfirmationEmail } = require('../utils/email');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Body shape expected:
 * {
 *   customerName, customerEmail, customerPhone, deliveryAddress, notes,
 *   items: [{ menuItemId, quantity }, ...]
 * }
 */
async function createOrder(req, res) {
  const {
    customerName,
    customerEmail,
    customerPhone,
    deliveryAddress,
    notes,
    items,
  } = req.body || {};

  // --- validation ---
  const errors = {};
  if (!customerName || !customerName.trim()) errors.customerName = 'Name is required.';
  if (!customerEmail || !isValidEmail(customerEmail)) errors.customerEmail = 'A valid email is required.';
  if (!Array.isArray(items) || items.length === 0) errors.items = 'Add at least one item to your order.';

  if (Array.isArray(items)) {
    for (const item of items) {
      if (!item.menuItemId || !Number.isInteger(item.quantity) || item.quantity < 1) {
        errors.items = 'Each item needs a valid menuItemId and a quantity of at least 1.';
        break;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Look up current prices/names server-side — never trust prices from the client.
    const menuItemIds = items.map((i) => i.menuItemId);
    const menuResult = await client.query(
      'SELECT id, name, price FROM menu_items WHERE id = ANY($1) AND is_available = true',
      [menuItemIds]
    );

    const menuMap = new Map(menuResult.rows.map((row) => [row.id, row]));

    // Make sure every requested item actually exists / is available
    for (const item of items) {
      if (!menuMap.has(item.menuItemId)) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          errors: { items: `Menu item ${item.menuItemId} is unavailable or doesn't exist.` },
        });
      }
    }

    const totalAmount = items.reduce((sum, item) => {
      const menuItem = menuMap.get(item.menuItemId);
      return sum + Number(menuItem.price) * item.quantity;
    }, 0);

    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, customer_email, customer_phone, delivery_address, notes, total_amount, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id, customer_name, customer_email, customer_phone, delivery_address, notes, total_amount, status, created_at`,
      [customerName.trim(), customerEmail.trim(), customerPhone || null, deliveryAddress || null, notes || null, totalAmount]
    );

    const order = orderResult.rows[0];

    const insertedItems = [];
    for (const item of items) {
      const menuItem = menuMap.get(item.menuItemId);
      const itemResult = await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, item_name, unit_price, quantity)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING item_name, unit_price, quantity`,
        [order.id, item.menuItemId, menuItem.name, menuItem.price, item.quantity]
      );
      insertedItems.push(itemResult.rows[0]);
    }

    await client.query('COMMIT');

    // Email is sent after commit — a slow/failed email should never roll back a paid order.
    const emailResult = await sendOrderConfirmationEmail(order, insertedItems);

    res.status(201).json({
      order: { ...order, items: insertedItems },
      email: emailResult,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Could not place order right now. Please try again.' });
  } finally {
    client.release();
  }
}

async function getOrderById(req, res) {
  const { id } = req.params;

  try {
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const itemsResult = await pool.query(
      'SELECT item_name, unit_price, quantity FROM order_items WHERE order_id = $1',
      [id]
    );

    res.json({ ...orderResult.rows[0], items: itemsResult.rows });
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Could not fetch order.' });
  }
}

module.exports = { createOrder, getOrderById };
