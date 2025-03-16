const pool = require('../config/db');
// const db = require("../config/postgresql")
const PGSDB = require('../library/pgsdb'); // Import the class
const db = new PGSDB(); // Create instance

// Updated method using PGSDB class

const LeaveData = {
  // async getAllLeaveApplications() {
  // return db.selectAll(
  //   'public.leave_applications', 
  //   '*', 
  //   [], 
  //   'AND', 
  //   ['requested_date DESC']
  // );


  async getAllLeaveApplications() {
    // return db.selectAll(
    //   'leave_applications', // Table with schema
    //   '*',                         // All columns
    //   []                           // No conditions
    //   // Omit link (defaults to null)
    //   // Omit orderBy (defaults to empty array)
    // );


    const res = await db.raw('SELECT * FROM leave_applications');
    // console.log('Raw query result:', res); // Should show data
    return res;

  },

  async getAllLeaveData() {
    // const query = 'SELECT * FROM leave_data';
    // return pool.query(query);

    const res = await db.raw('SELECT * FROM leave_data');
    return res;
  },

  async updateLeaveData(user_id, leaveData) {
    const query = `
      UPDATE leave_data SET EL = $1, SL = $2, CL = $3, CO = $4, SO = $5, SML = $6, 
      ML = $7, CW = $8, OOD = $9, HL = $10, COL = $11, WFH = $12, WO = $13, MP = $14, A = $15
      WHERE user_id = $16 RETURNING *`;
    const values = [
      leaveData.EL, leaveData.SL, leaveData.CL, leaveData.CO, leaveData.SO, leaveData.SML,
      leaveData.ML, leaveData.CW, leaveData.OOD, leaveData.HL, leaveData.COL, leaveData.WFH,
      leaveData.WO, leaveData.MP, leaveData.A, user_id
    ];
    return pool.query(query, values);
  },

  async applyLeave(leaveApplication) {
    const query = `
      INSERT INTO leave_applications (user_id, user_name, leave_type, from_date, to_date, leave_days, reason, file, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending') RETURNING *`;
    const values = [
      leaveApplication.user_id, leaveApplication.user_name, leaveApplication.leave_type,
      leaveApplication.from_date, leaveApplication.to_date, leaveApplication.leave_days,
      leaveApplication.reason, leaveApplication.file
    ];
    return pool.query(query, values);
  },

  async reduceLeaveBalance(user_id, leave_type, leave_days) {
    const updateLeaveDataQuery = `
      UPDATE leave_balance
      SET ${leave_type.toLowerCase()}_availed = ${leave_type.toLowerCase()}_availed + $1
      WHERE user_id = $2
      RETURNING ${leave_type.toLowerCase()}_availed`;
    const leaveDataResult = await pool.query(updateLeaveDataQuery, [leave_days, user_id]);

    // const updateAvailableLeaveQuery = `
    //   UPDATE leave_balance
    //   SET ${leave_type.toLowerCase()}_available = ${leave_type.toLowerCase()}_available - $1
    //   WHERE user_id = $2
    //   RETURNING ${leave_type.toLowerCase()}_available`;
    // const availableLeaveResult = await pool.query(updateAvailableLeaveQuery, [leave_days, user_id]);

    return { leaveDataResult,
        //  availableLeaveResult 
        };
  },

  // async getAllLeaveApplications() {
  //   const query = 'SELECT * FROM leave_applications ORDER BY requested_date DESC'; // old db table sivasaran
  //   return pool.query(query);
  // },

  // async getAllLeaveApplicationsNew() {
  //   const query = 'SELECT * FROM leave_applications_new';


  //   // const query = 'SELECT * FROM leave_applications_new ORDER BY requested_date DESC';
  //   return pool.query(query);
  // },
//   async getAllLeaveApplicationsNew(req, res) {
//     try {
//       const result = await LeaveData.getAllLeaveApplicationsNew();
//       console.log('🔍 Data from leave_applications_new:', JSON.stringify(result.rows, null, 2)); // Log query result
//       res.json(result.rows);
//     } catch (err) {
//       console.error('❌ Error fetching leave applications new:', err);
//       res.status(500).send('Internal Server Error');
//     }
//   }
// ,  

  // async updateLeaveStatus(id, status, remarks ) {
  //   approved_by="nnull"
  //   const query = 'UPDATE leave_applications SET status = $1, remarks = $2, approved_by ={approved_by}  WHERE id = $3 RETURNING *';
  //   return pool.query(query, [status, remarks || 'default-x', id]);
  // },

  async updateLeaveStatus(id, status, remarks, approved_by) {
    const query = `
      UPDATE leave_applications 
      SET 
        status = $1, 
        remarks = COALESCE($2, 'default-x'), 
        approved_by = $3 
      WHERE id = $4 
      RETURNING *
    `;
    
    return pool.query(query, [
      status,
      remarks,  // remarks can be null/undefined
      approved_by ,     // approved_by set to NULL
      id
    ]);
  },

  async updateLeaveBalance(user_id, leave_type, leave_days, action) {
    const updateLeaveDataQuery = `
      UPDATE leave_balance
      SET ${leave_type.toLowerCase()}_availed = ${leave_type.toLowerCase()}_availed ${action} $1
      WHERE user_id = $2`;
    await pool.query(updateLeaveDataQuery, [leave_days, user_id]);

    const updateAvailableLeaveQuery = `
      UPDATE leave_balance
      SET ${leave_type.toLowerCase()}_available = ${leave_type.toLowerCase()}_available ${action === '+' ? '-' : '+'} $1
      WHERE user_id = $2`;
    await pool.query(updateAvailableLeaveQuery, [leave_days, user_id]);
  },

  async deleteLeaveApplication(id) {
    const query = 'DELETE FROM leave_applications WHERE id = $1 RETURNING *';
    return pool.query(query, [id]);
  }
};

module.exports = LeaveData;