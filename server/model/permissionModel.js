const PGSDB = require('../library/pgsdb'); // Import the class
const db = new PGSDB(); // Create instance

const Permission = {
  async addPermission(user_id, user_name, date, in_time, out_time, reason) {
    const query = `
      INSERT INTO permissions_new (
        userid, request_date, perm_date, from_time, to_time, reason, total_hours
      )
      VALUES ($1, CURRENT_DATE, $2, $3, $4, $5,
        EXTRACT(EPOCH FROM ($4::time - $3::time)) / 3600
      ) RETURNING *`;
    const values = [user_id, date, in_time, out_time, reason];
    const result = await db.raw(query, values);
    return result[0];
  },



  async getAllPermissions() {
    const query = 'SELECT * FROM permissions_new';
    const result = await db.raw(query);
    return result;
  },

  async updatePermissionStatus(id, status, approved_by_name) {
    const query = `
      UPDATE permissions_new 
      SET status = $1, approved_by = $2, approved_datetime = CURRENT_TIMESTAMP
      WHERE id = $3 
      RETURNING *`;
    const values = [status, approved_by_name, id];
    const result = await db.raw(query, values);
    return result[0];
  }
  
};

module.exports = Permission;
