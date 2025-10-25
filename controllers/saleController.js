import pool from '../db.js';

const saleController = {
  getAllSales: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM sales');
      res.json({ status: 'success', data: rows });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  getSaleById: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM sales WHERE id = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ status: 'fail', message: 'Sale not found' });
      }
      res.json({ status: 'success', data: rows[0] });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  createSale: async (req, res) => {
    try {
      const { product_id, distributor_id, quantity } = req.body;
      const [result] = await pool.query('INSERT INTO sales (product_id, distributor_id, quantity) VALUES (?, ?, ?)', [product_id, distributor_id, quantity]);
      res.status(201).json({ status: 'success', data: { id: result.insertId, product_id, distributor_id, quantity } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  updateSale: async (req, res) => {
    try {
      const { product_id, distributor_id, quantity } = req.body;
      const [result] = await pool.query('UPDATE sales SET product_id = ?, distributor_id = ?, quantity = ? WHERE id = ?', [product_id, distributor_id, quantity, req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: 'fail', message: 'Sale not found' });
      }
      res.json({ status: 'success', data: { id: req.params.id, product_id, distributor_id, quantity } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  deleteSale: async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM sales WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: 'fail', message: 'Sale not found' });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
};

export default saleController;
