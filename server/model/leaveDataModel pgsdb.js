const PGSDB = require('../library/pgsdb');
const db = new PGSDB();

const LeaveData = {
  async getAllLeaveApplications() {
    return db.raw('SELECT * FROM leave_applications ORDER BY requested_date DESC');
  },

  async getAllLeaveData() {
    return db.raw('SELECT * FROM leave_data');
  },

  async updateLeaveData(user_id, leaveData) {
    const query = `
      UPDATE leave_data SET 
        EL = $1, SL = $2, CL = $3, CO = $4, SO = $5, SML = $6,
        ML = $7, CW = $8, OOD = $9, HL = $10, COL = $11, 
        WFH = $12, WO = $13, MP = $14, A = $15
      WHERE user_id = $16 
      RETURNING *`;
    
    const values = [
      leaveData.EL, leaveData.SL, leaveData.CL, leaveData.CO, 
      leaveData.SO, leaveData.SML, leaveData.ML, leaveData.CW,
      leaveData.OOD, leaveData.HL, leaveData.COL, leaveData.WFH,
      leaveData.WO, leaveData.MP, leaveData.A, user_id
    ];
    
    return db.raw(query, values);
  },

  async applyLeave(leaveApplication) {
    const query = `
      INSERT INTO leave_applications 
        (user_id, user_name, leave_type, from_date, to_date, 
         leave_days, reason, file, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending')
      RETURNING *`;
    
    const values = [
      leaveApplication.user_id, leaveApplication.user_name,
      leaveApplication.leave_type, leaveApplication.from_date,
      leaveApplication.to_date, leaveApplication.leave_days,
      leaveApplication.reason, leaveApplication.file
    ];
    
    return db.raw(query, values);
  },

  async reduceLeaveBalance(user_id, leave_type, leave_days) {
    const lt = leave_type.toLowerCase();
    
    const updateQuery = `
      UPDATE leave_balance
      SET ${lt}_availed = ${lt}_availed + $1
      WHERE user_id = $2
      RETURNING ${lt}_availed`;
    
    const result = await db.raw(updateQuery, [leave_days, user_id]);
    return { leaveDataResult: result };
  },

  async updateLeaveStatus(id, status, remarks, approved_by) {
    const query = `
      UPDATE leave_applications 
      SET 
        status = $1, 
        remarks = COALESCE($2, 'default-x'), 
        approved_by = $3 
      WHERE id = $4 
      RETURNING *`;
    
    return db.raw(query, [status, remarks, approved_by, id]);
  },

  async updateLeaveBalance(user_id, leave_type, leave_days, action) {
    const lt = leave_type.toLowerCase();
    
    const updateAvailedQuery = `
      UPDATE leave_balance
      SET ${lt}_availed = ${lt}_availed ${action} $1
      WHERE user_id = $2`;
    
    await db.raw(updateAvailedQuery, [leave_days, user_id]);

    const updateAvailableQuery = `
      UPDATE leave_balance
      SET ${lt}_available = ${lt}_available ${action === '+' ? '-' : '+'} $1
      WHERE user_id = $2`;
    
    await db.raw(updateAvailableQuery, [leave_days, user_id]);
  },

  async deleteLeaveApplication(id) {
    return db.raw('DELETE FROM leave_applications WHERE id = $1 RETURNING *', [id]);
  }
};

module.exports = LeaveData;