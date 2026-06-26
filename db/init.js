const { Client } = require("pg");
require("dotenv").config();

async function createTables() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production"
                ? { rejectUnauthorized: false }
                : false,
    });

    await client.connect();

    await client.query(`
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            description TEXT,
            image_url TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS items (
            id SERIAL PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            description TEXT,
            price NUMERIC(10, 2) NOT NULL,
            stock_quantity INTEGER NOT NULL DEFAULT 0,
            size VARCHAR(20),
            color VARCHAR(50),
            image_url TEXT,
            category_id INTEGER NOT NULL REFERENCES categories(id),
            created_at TIMESTAMP DEFAULT NOW()
        );
    `);

    console.log("Tables created.");
    await client.end();
}

createTables().catch(err => {
    console.log("Error creating tables:", err);
    process.exit(1);
});