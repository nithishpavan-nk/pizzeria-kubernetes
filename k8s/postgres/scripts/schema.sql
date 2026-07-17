-- Nithish Pizzeria — database schema
-- Run automatically on container startup (see docker-compose.yml volume mount)

CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category VARCHAR(40) NOT NULL,
  image_url VARCHAR(255),
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(30),
  delivery_address TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER NOT NULL REFERENCES menu_items(id),
  item_name VARCHAR(120) NOT NULL, -- snapshot, in case menu changes later
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);

-- Seed menu data (matches the existing frontend MenuList) — only seeds if table is empty
INSERT INTO menu_items (name, description, price, category, image_url)
SELECT * FROM (VALUES
  ('Pepperoni Pizza', 'Smoked pepperoni, mozzarella, house tomato sauce.', 15.99, 'Classic', '/menu-images/pepperoni.jpg'),
  ('Margherita Pizza', 'San Marzano tomatoes, fresh basil, fior di latte.', 11.99, 'Classic', '/menu-images/margherita.jpg'),
  ('PedroTech Special Pizza', 'Our chef''s signature build, loaded with everything.', 24.99, 'Specialty', '/menu-images/pedrotechspecial.jpg'),
  ('Vegan Pizza', 'Roasted vegetables, plant-based cheese, herb oil.', 17.99, 'Vegan', '/menu-images/vegan.jpg'),
  ('Pineapple Pizza', 'Sweet pineapple, ham, mozzarella. No judgment.', 14.99, 'Classic', '/menu-images/pineapple.jpg'),
  ('Truffle Deluxe Pizza', 'Truffle oil, wild mushrooms, parmesan shavings.', 22.99, 'Specialty', '/menu-images/expensive.jpg')
) AS seed(name, description, price, category, image_url)
WHERE NOT EXISTS (SELECT 1 FROM menu_items);
