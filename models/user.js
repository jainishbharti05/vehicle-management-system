// User model for PostgreSQL
const pool = require('./db');

const User = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM users ORDER BY id');
    return rows;
  },
  async create({ name, email, password, role }) {
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, password, role]
    );
    return rows[0];
  },
  async update(id, { name, email, password, role }) {
    const { rows } = await pool.query(
      'UPDATE users SET name = $1, email = $2, password = $3, role = $4 WHERE id = $5 RETURNING *',
      [name, email, password, role, id]
    );
    return rows[0];
  },
  async delete(id) {
    const { rows } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return rows[0];
  },
  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  },
};

module.exports = User;
