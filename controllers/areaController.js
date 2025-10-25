import pool from '../db.js';

const areaController = {
  getAllAreas: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM areas');
      res.json({ status: 'success', data: rows });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  getAreaById: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM areas WHERE id = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ status: 'fail', message: 'Area not found' });
      }
      res.json({ status: 'success', data: rows[0] });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  createArea: async (req, res) => {
    try {
      const { name } = req.body;
      const [result] = await pool.query('INSERT INTO areas (name) VALUES (?)', [name]);
      res.status(201).json({ status: 'success', data: { id: result.insertId, name } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  updateArea: async (req, res) => {
    try {
      const { name } = req.body;
      const [result] = await pool.query('UPDATE areas SET name = ? WHERE id = ?', [name, req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: 'fail', message: 'Area not found' });
      }
      res.json({ status: 'success', data: { id: req.params.id, name } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  deleteArea: async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM areas WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: 'fail', message: 'Area not found' });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
};

export default areaController;
