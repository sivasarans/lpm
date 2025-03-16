const pool = require('../config/db');
const PGSDB = require('../library/pgsdb'); // Import the class
const db = new PGSDB(); // Create instance

const Permission = {
  async addPermission(user_id,user_name, date, in_time, out_time, reason) {
    const query = `
      INSERT INTO Permissions (user_id,username, date, in_time, out_time, reason)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const values = [user_id, user_name, date, in_time, out_time, reason];
      console.log('values:', values);
    const result = await db.raw(query, values);
  return result[0]; // Return the inserted row
},
  async getAllPermissions() {
    const query = 'SELECT * FROM public.permissions';
    const result = await db.raw(query);
    return result;
  },

  async updatePermissionStatus(id, status) {
    const query = `
      UPDATE permissions SET status = $1 WHERE id = $2 RETURNING *`;
    const values = [status, id];
    return result = await db.raw(query, values);
    // return result.rows[0];
  }
};

module.exports = Permission;