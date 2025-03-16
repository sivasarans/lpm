const pool = require('../config/db');

const Reports = {
  async executeQuery(query) {
    const result = await pool.query(query);
    return result.rows;
  }
};

module.exports = Reports;