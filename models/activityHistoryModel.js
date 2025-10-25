import pool from '../config/db.js';

const activityHistoryModel = {
  async create(activity) {
    const { user_id, action_type, details } = activity;
    const { rows } = await pool.query(
      'INSERT INTO activity_history (user_id, action_type, details) VALUES ($1, $2, $3) RETURNING *',
      [user_id, action_type, details]
    );
    return rows[0];
  }
};

export default activityHistoryModel;
