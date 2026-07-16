const db = require('../db/pool');

async function getAllMenuItems(req, res) {
  try {
    const result = await db.query(
      'SELECT id, name, description, price, category, image_url FROM menu_items WHERE is_available = true ORDER BY category, name'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).json({ error: 'Could not load menu right now.' });
  }
}

module.exports = { getAllMenuItems };
