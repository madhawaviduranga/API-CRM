import pool from '../config/db.js';

const counterModel = {
  async getNext(counterName) {
    const { rows } = await pool.query(
      'UPDATE counters SET current_value = current_value + 1 WHERE counter_name = $1 RETURNING current_value',
      [counterName]
    );
    return rows[0].current_value;
  }
};

export default counterModel;
