const pool = require("./pool");

const categoryDb = {
    getAll: async () => {
        const { rows } = await pool.query(
            `SELECT c.*, COUNT(i.id)::int AS item_count
            FROM categories c
            LEFT JOIN items i ON i.category_id = c.id
            GROUP BY c.id
            ORDER BY c.name`
        );
        return rows;
    },

    getById: async (id) => {
        const { rows } = await pool.query(
            "SELECT * FROM categories WHERE id = $1",
            [id]
        );
        return rows[0];
    },

    create: async ({ name, description, image_url }) => {
        const { rows } = await pool.query(
            `INSERT INTO categories (name, description, image_url)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [name, description, image_url]
        );
        return rows[0];
    },

    update: async (id, { name, description, image_url }) => {
        const { rows } = await pool.query(
            `UPDATE categories SET name=$1, description=$2, image_url=$3 
            WHERE id=$4
            RETURNING *`,
            [name, description, image_url, id]
        );
        return rows[0];
    },

    delete: async (id) => {
        await pool.query("DELETE FROM categories WHERE id=$1", [id]);
    },

    getItemCount: async (id) => {
        const { rows } = await pool.query(
            `SELECT COUNT(*)::int AS count FROM items WHERE category_id=$1`,
            [id]
        );
        return rows[0].count;
    },
};

module.exports = categoryDb;