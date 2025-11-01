-- =======================================
-- PRODUCT SEED DATA
-- =======================================

INSERT INTO products (name, description, price, image, model3d, category, quantity, is_featured)
VALUES
-- Chair
('Modern Chair', 
 'A sleek and modern wooden chair with a curved backrest and minimalist legs — perfect for living or workspace interiors.', 
 59.99, 
 'products/chair.png', 
 'models/chair.glb', 
 'Chair', 
 8, 
 false),

-- Park Table
('Park Table', 
 'A durable outdoor park table made from weather-resistant oak and reinforced metal legs, ideal for patios and community areas.', 
 129.50, 
 'products/park table.png', 
 'models/park table.glb', 
 'Table', 
 3, 
 TRUE),

-- Vintage Cabinet
('Vintage Cabinet', 
 'A beautifully restored vintage cabinet with brass handles and a distressed finish. Great for adding a classic touch to any room.', 
 210.00, 
 'products/vintage cabinet.png', 
 'models/vintage cabinet.glb', 
 'Cabinet', 
 2, 
 TRUE),

-- Rustic Chair
('Rustic Chair', 
 'Handcrafted rustic-style chair made from reclaimed wood. Each piece is unique, bringing warmth and authenticity to your space.', 
 75.00, 
 'products/rustic chair.png', 
 'models/rustic chair.glb', 
 'Chair', 
 5, 
 True);