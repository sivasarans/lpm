const LeaveBalance = require('../model/leaveBalanceModel');

const leaveBalanceController = {
  async getAllLeaveData(req, res) {


    try {
      const result = await LeaveBalance.getAllLeaveData();
      // res.json(result.rows);
      res.status(200).send(result); // ❌ Returns full PG result object

    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching leave data');
    }
  },

  async updateLeaveData(req, res) {
    const { user_id } = req.params;
    const leaveData = req.body;

    try {
      const result = await LeaveBalance.updateLeaveData(user_id, leaveData);
      res.status(200).json({
        message: 'Leave data updated successfully',
        data: result.rows[0]
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating leave data');
    }
  },

  async reduceLeaveBalance(req, res) {
    const { user_id, leave_type, leave_days } = req.body;

    if (!user_id || !leave_type || !leave_days) {
      return res.status(400).send('User ID, leave type, and leave days are required');
    }

    try {
      const result = await LeaveBalance.reduceLeaveBalance(user_id, leave_type, leave_days);

      if (result.rows.length === 0) {
        return res.status(400).send('Insufficient leave balance or user not found');
      }

      res.status(200).json({
        message: `${leave_type} balance updated successfully`,
        data: result.rows[0]
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error reducing leave balance');
    }
  },

  async getLeaveSetAdmin(req, res) {
    try {
      const result = await LeaveBalance.getLeaveSetAdmin();
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching leave data');
    }
  },

  async updateLeaveSetAdmin(req, res) {
    const { role_name, ...leaveDefaults } = req.body;

    if (!role_name) {
      return res.status(400).send('Role name is required');
    }

    try {
      await LeaveBalance.updateLeaveSetAdmin(role_name, leaveDefaults);
      res.send('Leave defaults updated successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating leave defaults');
    }
  },
};

module.exports = leaveBalanceController;