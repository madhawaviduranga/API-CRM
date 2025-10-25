import pool from '../config/db.js';

const productModel = {
  async getAll(limit, offset) {
    const { rows } = await pool.query('SELECT * FROM products LIMIT $1 OFFSET $2', [limit, offset]);
    const { rows: countRows } = await pool.query('SELECT COUNT(*) FROM products');
    const totalProducts = parseInt(countRows[0].count, 10);

    return { products: rows, totalProducts };
  },

  async getById(id) {
    const { rows } = await pool.query('SELECT * FROM products WHERE product_id = $1', [id]);
    return rows[0];
  },

  async create(product) {
    const { product_name, description, price, stock } = product;
    const { rows } = await pool.query(
      'INSERT INTO products (product_name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [product_name, description, price, stock]
    );
    return rows[0];
  },

  async update(id, product) {
    const { product_name, description, price, stock } = product;
    const { rows } = await pool.query(
      'UPDATE products SET product_name = $1, description = $2, price = $3, stock = $4 WHERE product_id = $5 RETURNING *',
      [product_name, description, price, stock, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await pool.query('DELETE FROM products WHERE product_id = $1 RETURNING *', [id]);
    return rows[0];
  }
};

export default productModel;
