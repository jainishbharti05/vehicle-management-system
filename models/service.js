// Service model for PostgreSQL
const pool = require('./db');

const Service = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM services ORDER BY id');
    return rows;
  },
  async create({ name, description, price, mechanic_id, status, duration_estimate, vehicle_id }) {
    const { rows } = await pool.query(
      'INSERT INTO services (name, description, price, mechanic_id, status, duration_estimate, vehicle_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, price, mechanic_id, status, duration_estimate, vehicle_id]
    );
    return rows[0];
  },
  async update(id, { name, description, price, mechanic_id, status, duration_estimate, vehicle_id }) {
    const { rows } = await pool.query(
      'UPDATE services SET name = $1, description = $2, price = $3, mechanic_id = $4, status = $5, duration_estimate = $6, vehicle_id = $7 WHERE id = $8 RETURNING *',
      [name, description, price, mechanic_id, status, duration_estimate, vehicle_id, id]
    );
    return rows[0];
  },
  async delete(id) {
    const { rows } = await pool.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
    return rows[0];
  },
};

module.exports = Service;
