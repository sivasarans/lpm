const pool = require('../config/db');

const LeaveBalance = {
  async getAllLeaveData() {
    const query = 'SELECT * FROM leave_balance';
    return pool.query(query);
  },

  async updateLeaveData(user_id, leaveData) {
    const query = `
      UPDATE leave_balance SET
        EL_available = $1, EL_availed = $2,
        SL_available = $3, SL_availed = $4,
        CL_available = $5, CL_availed = $6,
        CO_available = $7, CO_availed = $8,
        OOD_available = $9, OOD_availed = $10,
        SML_available = $11, SML_availed = $12,
        WFH_available = $13, A_available = $14,
        ML_available = $15, PL_available = $16, MP_available = $17
      WHERE user_id = $18
      RETURNING *;
    `;
    const values = [
      leaveData.EL_available, leaveData.EL_availed,
      leaveData.SL_available, leaveData.SL_availed,
      leaveData.CL_available, leaveData.CL_availed,
      leaveData.CO_available, leaveData.CO_availed,
      leaveData.OOD_available, leaveData.OOD_availed,
      leaveData.SML_available, leaveData.SML_availed,
      leaveData.WFH_available, leaveData.A_available,
      leaveData.ML_available, leaveData.PL_available, leaveData.MP_available,
      user_id
    ];
    return pool.query(query, values);
  },

  async reduceLeaveBalance(user_id, leave_type, leave_days) {
    const query = `
      UPDATE leave_balance 
      SET ${leave_type}_availed = ${leave_type}_availed + $1
      WHERE user_id = $2 AND (${leave_type}_available - ${leave_type}_availed) >= $1
      RETURNING ${leave_type}_available, ${leave_type}_availed, (${leave_type}_available - ${leave_type}_availed) AS ${leave_type}_balance
    `;
    return pool.query(query, [leave_days, user_id]);
  },

  async getLeaveSetAdmin() {
    const query = 'SELECT * FROM leave_set_admin';
    return pool.query(query);
  },

  async updateLeaveSetAdmin(role_name, leaveDefaults) {
    console.log(leaveDefaults)
    const query = `
      UPDATE leave_set_admin
      SET 
        el_default = $1,
        sl_default = $2,
        cl_default = $3,
        co_default = $4,
        ood_default = $5,
        wfh_default = $6,
        ml_default = $7,
        pl_default = $8,
        mp_default = $9
      WHERE role_name = $10
    `;
    const values = [
        leaveDefaults.el_default, leaveDefaults.sl_default, leaveDefaults.cl_default,
        leaveDefaults.co_default, leaveDefaults.ood_default, leaveDefaults.wfh_default,
        leaveDefaults.ml_default, leaveDefaults.pl_default, leaveDefaults.mp_default,
        role_name
      ];
    return pool.query(query, values);
  },
};

module.exports = LeaveBalance;