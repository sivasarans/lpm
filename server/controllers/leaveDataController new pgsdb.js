const LeaveData = require('../model/leaveDataModel');

const leaveDataController = {
  async getAllLeaveData(req, res) {
    try {
      const result = await LeaveData.getAllLeaveData();
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching leave data');
    }
  },

  async updateLeaveData(req, res) {
    const { user_id } = req.params;
    const leaveData = req.body;

    try {
      const result = await LeaveData.updateLeaveData(user_id, leaveData);
      res.status(200).json({ 
        message: 'Leave data updated successfully', 
        data: result.rows[0] 
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating leave data');
    }
  },

  async applyLeave(req, res) {
    // ... (existing applyLeave implementation remains the same)
  },

  async reduceLeaveBalance(req, res) {
    const { user_id, leave_type, leave_days } = req.body;
  
    if (!user_id || !leave_type || !leave_days) {
      return res.status(400).send('User ID, leave type, and leave days are required');
    }
  
    try {
      const { leaveDataResult } = await LeaveData.reduceLeaveBalance(user_id, leave_type, leave_days);
  
      if (leaveDataResult.rows.length === 0) {
        return res.status(400).send('Insufficient leave balance or user not found');
      }
  
      const updatedAvailedBalance = leaveDataResult.rows[0][`${leave_type.toLowerCase()}_availed`];
  
      res.status(200).json({
        message: `${leave_type} balance updated successfully. New availed balance: ${updatedAvailedBalance}`,
        data: {
          availed: updatedAvailedBalance,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error reducing leave balance');
    }
  },

  async getAllLeaveApplications(req, res) {
    try {
      const result = await LeaveData.getAllLeaveApplications();
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching leave applications:', err);
      res.status(500).send('Internal Server Error');
    }
  },

  async updateLeaveStatus(req, res) {
    // ... (existing updateLeaveStatus implementation remains the same)
  },

  async deleteLeaveApplication(req, res) {
    const { id } = req.params;

    try {
      const result = await LeaveData.deleteLeaveApplication(id);

      if (result.rowCount === 0) {
        return res.status(404).send('Leave application not found');
      }

      res.status(200).json({ 
        message: 'Leave application deleted successfully', 
        data: result.rows[0] 
      });
    } catch (err) {
      console.error('Error deleting leave application:', err);
      res.status(500).send('Internal Server Error');
    }
  }
};

module.exports = leaveDataController;