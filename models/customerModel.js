import pool from '../config/db.js';

const customerModel = {
  async getAll(limit, offset) {
    const { rows } = await pool.query('SELECT * FROM customers LIMIT $1 OFFSET $2', [limit, offset]);
    const { rows: countRows } = await pool.query('SELECT COUNT(*) FROM customers');
    const totalCustomers = parseInt(countRows[0].count, 10);

    return { customers: rows, totalCustomers };
  },

  async getById(id) {
    const { rows } = await pool.query('SELECT * FROM customers WHERE customer_id = $1', [id]);
    return rows[0];
  },

  async create(customer) {
    const { customer_name, contact_person, phone_number, address, email, status_id, route_id } = customer;
    const { rows } = await pool.query(
      'INSERT INTO customers (customer_name, contact_person, phone_number, address, email, status_id, route_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [customer_name, contact_person, phone_number, address, email, status_id, route_id]
    );
    return rows[0];
  },

  async update(id, customer) {
    const { customer_name, contact_person, phone_number, address, email, status_id, route_id } = customer;
    const { rows } = await pool.query(
      'UPDATE customers SET customer_name = $1, contact_person = $2, phone_number = $3, address = $4, email = $5, status_id = $6, route_id = $7 WHERE customer_id = $8 RETURNING *',
      [customer_name, contact_person, phone_number, address, email, status_id, route_id, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await pool.query('DELETE FROM customers WHERE customer_id = $1 RETURNING *', [id]);
    return rows[0];
  }
};

export default customerModel;
