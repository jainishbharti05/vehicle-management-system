// Vehicle model for PostgreSQL
const pool = require('./db');

const Vehicle = {
  async getAll() {
    const { rows } = await pool.query('SELECT * FROM vehicles ORDER BY id');
    return rows;
  },
  async create({ make, model, year, vin, owner_id }) {
    const { rows } = await pool.query(
      'INSERT INTO vehicles (make, model, year, vin, owner_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [make, model, year, vin, owner_id]
    );
    return rows[0];
  },
  async update(id, { make, model, year, vin, owner_id }) {
    const { rows } = await pool.query(
      'UPDATE vehicles SET make = $1, model = $2, year = $3, vin = $4, owner_id = $5 WHERE id = $6 RETURNING *',
      [make, model, year, vin, owner_id, id]
    );
    return rows[0];
  },
  async delete(id) {
    const { rows } = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
    return rows[0];
  },
  async findByVIN(vin) {
    const { rows } = await pool.query('SELECT * FROM vehicles WHERE vin = $1', [vin]);
    return rows[0];
  },
};

module.exports = Vehicle;
