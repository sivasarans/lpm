const LeaveData = require('../model/leaveDataModel');

const leaveDataController = {
  async getAllLeaveData(req, res) {
    try {
      const result = await LeaveData.getAllLeaveData();
      res.status(200).send(result); // ❌ Returns full PG result object

      // res.json(result.rows);
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
      res.status(200).json({ message: 'Leave data updated successfully', data: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating leave data');
    }
  },

  async applyLeave(req, res) {
    const { user_id, user_name, leave_type, from_date, to_date, leave_days, reason } = req.body;
    console.log('📝 Leave application:', req.body);

    if (!user_id || !user_name || !leave_type || !from_date || !to_date || !leave_days || !reason) {
      return res.status(400).send('All fields are required');
    }

    try {
      const filePath = req.file ? `/uploads/users_leave_documents/${req.file.filename}` : null;
      const leaveApplication = { user_id, user_name, leave_type, from_date, to_date, leave_days, reason, file: filePath };
      // console.log("🛠 Applying leave to database with:", leaveApplication);

      const result = await LeaveData.applyLeave(leaveApplication);
      // Log result to debug
      // console.log("📌 Database result:", result);

      // Check if rows exist before accessing index 0
      // Check if result is undefined or empty
if (!result || !Array.isArray(result) || result.length === 0) {
  console.error("❌ Error: No rows returned from database", result);
  return res.status(500).json({ error: 'Failed to save leave application' });
}
res.status(201).json({ message: 'Leave application submitted successfully', data: result[0] });
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
      res.status(200).send(result); // ❌ Returns full PG result object

      // res.json(result.rows);
    } catch (err) {
      console.error('Error fetching leave applications:', err);
      res.status(500).send('Internal Server Error');
    }
  },
  // async getAllLeaveApplicationsNew(req, res) {
  //   try {
  //     const result = await LeaveData.getAllLeaveApplicationsNew();
  //     res.json(result.rows);
  //   } catch (err) {
  //     console.error('Error fetching leave applications new:', err);
  //     res.status(500).send('Internal Server Error');
  //   }
  // },

  async updateLeaveStatus(req, res) {
    const { id } = req.params;
    const { status, remarks, leave_days, leave_type, user_id, approved_by } = req.body;
    // console.log('�� Leave application   xmxx:', req.body);

    try {
      const result = await LeaveData.updateLeaveStatus(id, status, remarks, approved_by);

      if (result.rowCount === 0) {
        return res.status(404).send('Leave application not found or no changes made');
      }

      // if (status === 'Rejected') {
      //   await LeaveData.updateLeaveBalance(user_id, leave_type, leave_days, '-');
      // }
      console.log("leave balance update paused while rejected contoller --- > leavedatController -> line108")

      res.status(200).send('Leave status updated successfully');
    } catch (err) {
      console.error('Error updating leave status:', err);
      res.status(500).send('Error updating leave status');
    }
  },

  async deleteLeaveApplication(req, res) {
    const { id } = req.params;

    try {
      const result = await LeaveData.deleteLeaveApplication(id);

      if (result.rowCount === 0) {
        return res.status(404).send('Leave application not found');
      }

      res.status(200).json({ message: 'Leave application deleted successfully', data: result.rows[0] });
    } catch (err) {
      console.error('Error deleting leave application:', err);
      res.status(500).send('Internal Server Error');
    }
  }
};

module.exports = leaveDataController;