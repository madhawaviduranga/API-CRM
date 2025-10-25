import pool from '../db.js';

const distributorController = {
  getAllDistributors: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM distributors');
      res.json({ status: 'success', data: rows });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  getDistributorById: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM distributors WHERE id = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ status: 'fail', message: 'Distributor not found' });
      }
      res.json({ status: 'success', data: rows[0] });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  createDistributor: async (req, res) => {
    try {
      const { name, area_id } = req.body;
      const [result] = await pool.query('INSERT INTO distributors (name, area_id) VALUES (?, ?)', [name, area_id]);
      res.status(201).json({ status: 'success', data: { id: result.insertId, name, area_id } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  updateDistributor: async (req, res) => {
    try {
      const { name, area_id } = req.body;
      const [result] = await pool.query('UPDATE distributors SET name = ?, area_id = ? WHERE id = ?', [name, area_id, req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: 'fail', message: 'Distributor not found' });
      }
      res.json({ status: 'success', data: { id: req.params.id, name, area_id } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  deleteDistributor: async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM distributors WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: 'fail', message: 'Distributor not found' });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
};

export default distributorController;
