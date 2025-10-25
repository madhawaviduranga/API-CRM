import pool from '../config/db.js';

const settingModel = {
  async get(key) {
    const { rows } = await pool.query('SELECT * FROM settings WHERE setting_key = $1', [key]);
    return rows[0];
  },

  async set(key, value) {
    const { rows } = await pool.query(
      'INSERT INTO settings (setting_key, setting_value) VALUES ($1, $2) ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2 RETURNING *',
      [key, value]
    );
    return rows[0];
  }
};

export default settingModel;
