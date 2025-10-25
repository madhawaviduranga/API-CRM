import pool from '../db.js';

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM products');
      res.json({ status: 'success', data: rows });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  getProductById: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ status: 'fail', message: 'Product not found' });
      }
      res.json({ status: 'success', data: rows[0] });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const { name, price } = req.body;
      const [result] = await pool.query('INSERT INTO products (name, price) VALUES (?, ?)', [name, price]);
      res.status(201).json({ status: 'success', data: { id: result.insertId, name, price } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { name, price } = req.body;
      const [result] = await pool.query('UPDATE products SET name = ?, price = ? WHERE id = ?', [name, price, req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: 'fail', message: 'Product not found' });
      }
      res.json({ status: 'success', data: { id: req.params.id, name, price } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: 'fail', message: 'Product not found' });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
};

export default productController;
