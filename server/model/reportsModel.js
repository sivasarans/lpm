const PGSDB = require('../library/pgsdb');
const db = new PGSDB();

const Reports = {
  async executeQuery(query) {
    const result = await db.raw(query); // This should return result.rows
    return result.rows || result; // Fallback in case db.raw() directly returns rows
  },
};

module.exports = Reports;

// const Reports = {
//   async executeQuery(query) {
//     const result = await pool.query(query);
//     return result.rows;
//   }
// };

// module.exports = Reports;