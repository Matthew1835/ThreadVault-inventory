const pool = require("./pool");

const itemDb = {
    getAll: async () => {
        const { rows } = await pool.query(
            `SELECT i.*, c.name AS category_name
            FROM items i
            JOIN categories c ON c.id = i.category_id
            ORDER BY i.name`
        );
        return rows;
    },

    getById: async (id) => {
        const { rows } = await pool.query(
            `SELECT i.*, c.name AS category_name 
            FROM items i
            JOIN categories c ON c.id = i.category_id
            WHERE i.id = $1`,
            [id]
        );
        return rows[0];
    },

    getByCategory: async (categoryId) => {
        const { rows } = await pool.query(
            `SELECT * FROM items WHERE category_id = $1 ORDER BY name`,
            [categoryId]
        );
        return rows;
    },

    create: async ({ name, description, price, stock_quantity, size, color, image_url, category_id }) => {
        const { rows } = await pool.query(
            `INSERT INTO items(name, description, price, stock_quantity, size, color, image_url, category_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [name, description, price, stock_quantity, size, color, image_url, category_id]
        );
        return rows[0];
    },

    update: async (id, { name, description, price, stock_quantity, size, color, image_url, category_id }) => {
        const { rows } = await pool.query(
            `UPDATE items SET name=$1, description=$2, price=$3, stock_quantity=$4, size=$5, color=$6, image_url=$7, category_id=$8
            WHERE id=$9
            RETURNING *`,
            [name, description, price, stock_quantity, size, color, image_url, category_id, id]
        );
        return rows[0];
    },

    delete: async (id) => {
        await pool.query(`DELETE FROM items WHERE id=$1`, [id]);
    },
}

module.exports = itemDb;