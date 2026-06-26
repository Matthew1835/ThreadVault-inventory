const { Client } = require("pg");
require("dotenv").config();

async function seed() {
    console.log("Seeding database...");

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production"
                ? { rejectUnauthorized: false }
                : false,
    });

    await client.connect();

    // Clear existing data
    await client.query("DELETE FROM items");
    await client.query("DELETE FROM categories");
    await client.query("ALTER SEQUENCE categories_id_seq RESTART WITH 1");
    await client.query("ALTER SEQUENCE items_id_seq RESTART WITH 1");

    // Seed categories
    const categories = await client.query(`
        INSERT INTO categories (name, description, image_url) 
        VALUES ('Men''s Clothing', 'Shirts, trousers, jackets and more for men.', 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&q=80'),
            ('Women''s Clothing', 'Dresses, tops, skirts and more for women.', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80'),
            ('Kids'' Clothing', 'Comfortable and fun clothing for children.', 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&q=80'),
            ('Accessories', 'Bags, belts, hats, scarves and more.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80'),
            ('Footwear', 'Shoes, boots, sandals and sneakers for all.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80')
        RETURNING id, name
    `);

    const catMap = {};
    categories.rows.forEach(c => (catMap[c.name] = c.id));

    // Seed items
    await client.query(`
        INSERT INTO items (name, description, price, stock_quantity, size, color, image_url, category_id)
        VALUES -- Men's
            ('Classic White Oxford Shirt', 'Crisp cotton Oxford shirt, perfect for office or casual wear.', 39.99, 45, 'M', 'White', 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&q=80', ${catMap["Men's Clothing"]}),
            ('Slim Fit Chinos', 'Versatile slim-fit chinos in stretch cotton.', 54.99, 30, 'L', 'Navy', 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e0c?w=600&q=80', ${catMap["Men's Clothing"]}),
            ('Wool Blend Blazer', 'Tailored blazer in a wool-blend fabric. Single-breasted with notch lapels.', 129.99, 15, 'L', 'Charcoal', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80', ${catMap["Men's Clothing"]}),
            ('Graphic Tee – Minimalist', 'Relaxed-fit crew-neck tee with a subtle minimalist print.', 24.99, 60, 'S', 'Black', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', ${catMap["Men's Clothing"]}),
            ('Denim Jacket', 'Classic washed denim jacket with chest pockets.', 74.99, 22, 'M', 'Mid Blue', 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&q=80', ${catMap["Men's Clothing"]}),

            -- Women's
            ('Floral Midi Dress', 'Floaty midi dress in a vibrant floral print. Fully lined.', 69.99, 28, 'S', 'Multicolor', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80', ${catMap["Women's Clothing"]}),
            ('High-Waist Tailored Trousers', 'Wide-leg tailored trousers with a high waist and side pockets.', 64.99, 35, 'M', 'Camel', 'https://images.unsplash.com/photo-1594938374182-a55e905a8f6e?w=600&q=80', ${catMap["Women's Clothing"]}),
            ('Ribbed Knit Cardigan', 'Soft ribbed cardigan with a relaxed oversized fit.', 49.99, 40, 'L', 'Cream', 'https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?w=600&q=80', ${catMap["Women's Clothing"]}),
            ('Satin Slip Skirt', 'Elegant bias-cut satin skirt, midi length.', 44.99, 20, 'XS', 'Dusty Rose', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80', ${catMap["Women's Clothing"]}),
            ('Oversized Linen Blazer', 'Relaxed linen blazer for smart-casual looks.', 89.99, 18, 'M', 'Sage Green', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80', ${catMap["Women's Clothing"]}),

            -- Kids'
            ('Striped Cotton T-Shirt', 'Soft 100% cotton tee in fun stripes. Machine washable.', 14.99, 80, '5-6Y', 'Blue/White', 'https://images.unsplash.com/photo-1524010349062-860800f4b4bb?w=600&q=80', ${catMap["Kids' Clothing"]}),
            ('Dungarees', 'Adjustable strap dungarees in durable denim.', 34.99, 50, '3-4Y', 'Blue', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80', ${catMap["Kids' Clothing"]}),
            ('Cozy Hoodie', 'Fleece-lined hoodie with kangaroo pocket. Great for cooler days.', 29.99, 45, '7-8Y', 'Red', 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80', ${catMap["Kids' Clothing"]}),
            ('Floral Leggings Set', 'Two-piece set: floral top and matching leggings.', 22.99, 38, '2-3Y', 'Pink', 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=600&q=80', ${catMap["Kids' Clothing"]}),

            -- Accessories
            ('Leather Tote Bag', 'Spacious genuine leather tote with interior pockets.', 119.99, 12, 'One Size', 'Tan', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', ${catMap["Accessories"]}),
            ('Woven Belt', 'Braided woven belt with gold-tone buckle.', 19.99, 55, 'M', 'Brown', 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80', ${catMap["Accessories"]}),
            ('Wide Brim Sun Hat', 'Packable woven straw hat with a wide brim.', 34.99, 25, 'One Size', 'Natural', 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80', ${catMap["Accessories"]}),
            ('Silk Scarf', 'Lightweight silk scarf in an abstract print. Wear as neck scarf or hair wrap.', 29.99, 30, 'One Size', 'Burgundy', 'https://images.unsplash.com/photo-1601370552761-8cb644f68bf3?w=600&q=80', ${catMap["Accessories"]}),

            -- Footwear
            ('White Leather Sneakers', 'Clean minimalist leather sneakers with a rubber sole.', 89.99, 33, '42', 'White', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80', ${catMap["Footwear"]}),
            ('Chelsea Boots', 'Ankle-height Chelsea boots in smooth leather with elastic side panels.', 139.99, 20, '40', 'Black', 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&q=80', ${catMap["Footwear"]}),
            ('Strappy Sandals', 'Delicate strappy heeled sandals for evening wear.', 64.99, 16, '38', 'Gold', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80', ${catMap["Footwear"]}),
            ('Running Trainers', 'Lightweight mesh trainers with cushioned sole. Great for daily runs.', 79.99, 42, '43', 'Grey/Neon', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', ${catMap["Footwear"]})
    `);

    console.log("Seed complete! Categories and items inserted.");
    await client.end();
}

seed().catch(err => {
    console.log("Seed error:", err);
    process.exit(1);
});