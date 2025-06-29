// Audit log model for PostgreSQL
const pool = require('./db');

const Audit = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM audit_logs ORDER BY id DESC');
    return rows;
  },
  async logEvent({ user_id, action, details }) {
    const { rows } = await pool.query(
      'INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3) RETURNING *',
      [user_id, action, details]
    );
    return rows[0];
  },
  async delete(id) {
    const { rows } = await pool.query('DELETE FROM audit_logs WHERE id = $1 RETURNING *', [id]);
    return rows[0];
  },
};

module.exports = Audit;
