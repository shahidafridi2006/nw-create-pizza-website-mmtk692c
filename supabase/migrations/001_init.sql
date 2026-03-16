-- Pizza Website Database Schema
-- Initial migration for pizza ordering system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PIZZAS TABLE (Menu Items)
-- ============================================
CREATE TABLE IF NOT EXISTS pizzas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100) DEFAULT 'classic',
  is_available BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TOPPINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS toppings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PIZZA TOPPINGS JUNCTION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pizza_toppings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pizza_id UUID REFERENCES pizzas(id) ON DELETE CASCADE,
  topping_id UUID REFERENCES toppings(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT false,
  UNIQUE(pizza_id, topping_id)
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  delivery_address TEXT,
  order_type VARCHAR(50) DEFAULT 'delivery' CHECK (order_type IN ('delivery', 'pickup')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  special_instructions TEXT,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  pizza_id UUID REFERENCES pizzas(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  custom_toppings JSONB DEFAULT '[]',
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CART TABLE (Temporary shopping cart)
-- ============================================
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CART ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  pizza_id UUID REFERENCES pizzas(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  custom_toppings JSONB DEFAULT '[]',
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cart_id, pizza_id)
);

-- ============================================
-- CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_pizzas_category ON pizzas(category);
CREATE INDEX IF NOT EXISTS idx_pizzas_available ON pizzas(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_carts_session_id ON carts(session_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE pizzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE toppings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pizza_toppings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES FOR PIZZAS (Public read, admin write)
-- ============================================
CREATE POLICY "Pizzas are viewable by everyone" 
  ON pizzas FOR SELECT 
  USING (true);

CREATE POLICY "Only service role can insert pizzas" 
  ON pizzas FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only service role can update pizzas" 
  ON pizzas FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only service role can delete pizzas" 
  ON pizzas FOR DELETE 
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- POLICIES FOR TOPPINGS (Public read, admin write)
-- ============================================
CREATE POLICY "Toppings are viewable by everyone" 
  ON toppings FOR SELECT 
  USING (true);

CREATE POLICY "Only service role can insert toppings" 
  ON toppings FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only service role can update toppings" 
  ON toppings FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only service role can delete toppings" 
  ON toppings FOR DELETE 
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- POLICIES FOR ORDERS (Users can manage their own orders)
-- ============================================
CREATE POLICY "Orders are viewable by everyone for creation" 
  ON orders FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create orders" 
  ON orders FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update orders within 5 minutes of creation" 
  ON orders FOR UPDATE 
  USING (created_at > NOW() - INTERVAL '5 minutes')
  WITH CHECK (created_at > NOW() - INTERVAL '5 minutes');

CREATE POLICY "Only service role can delete orders" 
  ON orders FOR DELETE 
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- POLICIES FOR ORDER_ITEMS
-- ============================================
CREATE POLICY "Order items are viewable by everyone" 
  ON order_items FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create order items" 
  ON order_items FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update order items within 5 minutes" 
  ON order_items FOR UPDATE 
  USING (created_at > NOW() - INTERVAL '5 minutes')
  WITH CHECK (created_at > NOW() - INTERVAL '5 minutes');

CREATE POLICY "Only service role can delete order items" 
  ON order_items FOR DELETE 
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- POLICIES FOR CARTS
-- ============================================
CREATE POLICY "Carts are viewable by session" 
  ON carts FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create carts" 
  ON carts FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update carts" 
  ON carts FOR UPDATE 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete carts" 
  ON carts FOR DELETE 
  USING (true);

-- ============================================
-- POLICIES FOR CART_ITEMS
-- ============================================
CREATE POLICY "Cart items are viewable by everyone" 
  ON cart_items FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create cart items" 
  ON cart_items FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update cart items" 
  ON cart_items FOR UPDATE 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete cart items" 
  ON cart_items FOR DELETE 
  USING (true);

-- ============================================
-- POLICIES FOR CONTACT_MESSAGES
-- ============================================
CREATE POLICY "Anyone can create contact messages" 
  ON contact_messages FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Only service role can view contact messages" 
  ON contact_messages FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only service role can update contact messages" 
  ON contact_messages FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_pizzas_updated_at
  BEFORE UPDATE ON pizzas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at
  BEFORE UPDATE ON carts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (Initial pizzas)
-- ============================================
INSERT INTO pizzas (name, description, price, category, is_popular, is_available) VALUES
('Margherita', 'Fresh tomatoes, mozzarella cheese, basil, and olive oil on our signature crust', 12.99, 'classic', true, true),
('Pepperoni', 'Classic pepperoni with mozzarella cheese and tomato sauce', 14.99, 'classic', true, true),
('Hawaiian', 'Ham, pineapple, mozzarella cheese, and tomato sauce', 15.99, 'specialty', false, true),
('BBQ Chicken', 'Grilled chicken, BBQ sauce, red onions, cilantro, and mozzarella', 16.99, 'specialty', true, true),
('Veggie Supreme', 'Bell peppers, mushrooms, olives, onions, tomatoes, and mozzarella', 14.99, 'vegetarian', true, true),
('Meat Lovers', 'Pepperoni, sausage, bacon, ham, and ground beef with mozzarella', 18.99, 'specialty', true, true),
('Four Cheese', 'Mozzarella, parmesan, gorgonzola, and fontina cheese blend', 15.99, 'vegetarian', false, true),
('Buffalo Chicken', 'Spicy buffalo sauce, grilled chicken, red onions, and ranch drizzle', 16.99, 'specialty', false, true),
('Mushroom Truffle', 'Wild mushrooms, truffle oil, mozzarella, and fresh herbs', 17.99, 'gourmet', true, true),
('Prosciutto Arugula', 'Prosciutto, fresh arugula, parmesan, and balsamic glaze', 19.99, 'gourmet', false, true);

-- ============================================
-- SEED DATA (Initial toppings)
-- ============================================
INSERT INTO toppings (name, price, is_available) VALUES
('Extra Cheese', 2.00, true),
('Pepperoni', 1.50, true),
('Mushrooms', 1.00, true),
('Bell Peppers', 1.00, true),
('Onions', 0.75, true),
('Olives', 1.00, true),
('Jalapeños', 1.00, true),
('Bacon', 2.00, true),
('Sausage', 1.50, true),
('Ham', 1.50, true),
('Pineapple', 1.00, true),
('Anchovies', 2.00, true),
('Fresh Basil', 1.00, true),
('Garlic', 0.50, true),
('Spinach', 1.00, true);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================
CREATE OR REPLACE VIEW popular_pizzas AS
SELECT * FROM pizzas 
WHERE is_popular = true AND is_available = true
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW available_toppings AS
SELECT * FROM toppings 
WHERE is_available = true
ORDER BY name;

CREATE OR REPLACE VIEW order_summary AS
SELECT 
  o.id,
  o.customer_name,
  o.customer_email,
  o.status,
  o.total,
  o.order_type,
  o.created_at,
  COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id
ORDER BY o.created_at DESC;