const db = require('../config/pgsdb');
const leaveTable = 'leave_data';
const leaveApplicationsTable = 'leave_applications';
const leaveBalanceTable = 'leave_balance';

const leaveDataController = {
  async getAllLeaveData(req, res) {
    try {
      const result = await db.select(leaveTable, '*');
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching leave data');
    }
  },

  async updateLeaveData(req, res) {
    const { user_id } = req.params;
    const leaveData = req.body;
    try {
      const updateResult = await db.update(leaveTable, leaveData, [`user_id = '${user_id}'`]);
      res.status(200).json({ message: 'Leave data updated successfully', data: updateResult });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating leave data');
    }
  },

  async applyLeave(req, res) {
    const { user_id, user_name, leave_type, from_date, to_date, leave_days, reason } = req.body;
    if (!user_id || !user_name || !leave_type || !from_date || !to_date || !leave_days || !reason) {
      return res.status(400).send('All fields are required');
    }
    try {
      const filePath = req.file ? `/uploads/users_leave_documents/${req.file.filename}` : null;
      const leaveApplication = { user_id, user_name, leave_type, from_date, to_date, leave_days, reason, file: filePath, status: 'Pending' };
      const insertResult = await db.insert(leaveApplicationsTable, leaveApplication);
      res.status(201).json({ message: 'Leave application submitted successfully', data: insertResult });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error applying for leave');
    }
  },

  async reduceLeaveBalance(req, res) {
    const { user_id, leave_type, leave_days } = req.body;
    if (!user_id || !leave_type || !leave_days) {
      return res.status(400).send('User ID, leave type, and leave days are required');
    }
    try {
      const updateResult = await db.update(leaveBalanceTable, { [`${leave_type.toLowerCase()}_availed`]: `+ ${leave_days}` }, [`user_id = '${user_id}'`]);
      res.status(200).json({ message: 'Leave balance updated successfully', data: updateResult });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error reducing leave balance');
    }
  },

  async getAllLeaveApplications(req, res) {
    try {
      const result = await db.select(leaveApplicationsTable, '*', [], 'ORDER BY applied_date DESC');
      res.json(result);
    } catch (err) {
      console.error('Error fetching leave applications:', err);
      res.status(500).send('Internal Server Error');
    }
  },

  async updateLeaveStatus(req, res) {
    const { id } = req.params;
    const { status, reject_reason, leave_days, leave_type, user_id } = req.body;
    try {
      const updateResult = await db.update(leaveApplicationsTable, { status, reject_reason: reject_reason || '' }, [`id = '${id}'`]);
      if (status === 'Rejected') {
        await db.update(leaveBalanceTable, { [`${leave_type.toLowerCase()}_availed`]: `- ${leave_days}` }, [`user_id = '${user_id}'`]);
      }
      res.status(200).send('Leave status updated successfully');
    } catch (err) {
      console.error('Error updating leave status:', err);
      res.status(500).send('Error updating leave status');
    }
  },

  async deleteLeaveApplication(req, res) {
    const { id } = req.params;
    try {
      const deleteResult = await db.delete(leaveApplicationsTable, [`id = '${id}'`]);
      res.status(200).json({ message: 'Leave application deleted successfully', data: deleteResult });
    } catch (err) {
      console.error('Error deleting leave application:', err);
      res.status(500).send('Internal Server Error');
    }
  }
};

module.exports = leaveDataController;
