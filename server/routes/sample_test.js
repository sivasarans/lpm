const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Ensure this path is correct

router.get("/get-all-status", async (req, res) => {
    const leaveApplicationsTable = `public.leave_applications`;
    try {
        console.log("Fetching leave applications... server -> routes -> sample_test.js");

        // Fetch leave applications using SQL query
        const result = await pool.query(`SELECT * FROM ${leaveApplicationsTable}`);
        
        return res.status(200).json({ response: 'Success', LeaveApplications: result.rows });
    } catch (err) {
        console.error('Error fetching leave applications:', err);
        return res.status(500).json({ response: 'Error', message: err.message });
    }
});


// Fetch all leave applications
router.get("/leave-applications", async (req, res) => {
    try {
        const leaveApplications = await db.selectAll('public.leave_applications', '*', []);
        return res.status(200).json({ response: 'Success', leaveApplications });
    } catch (err) {
        console.error('Error fetching leave applications:', err);
        return res.status(500).json({ response: 'Error', message: err.message });
    }
});

// Apply for leave
router.post("/apply-leave", async (req, res) => {
    const { user_id, user_name, leave_type, from_date, to_date, leave_days, reason } = req.body;
    if (!user_id || !user_name || !leave_type || !from_date || !to_date || !leave_days || !reason) {
        return res.status(400).json({ response: 'Error', message: 'All fields are required' });
    }
    try {
        const data = { user_id, user_name, leave_type, from_date, to_date, leave_days, reason, status: 'Pending' };
        const result = await db.insert('public.leave_applications', data);
        return res.status(201).json({ response: 'Success', data: result });
    } catch (err) {
        console.error('Error applying for leave:', err);
        return res.status(500).json({ response: 'Error', message: err.message });
    }
});

router.post("/apply-leave-extra", async (req, res) => {
    try {
      const { user_id, user_name, leave_type, from_date, to_date, reason } = req.body;
      const file = req.file ? req.file.filename : null;
      const data = { userid: user_id, user_name, leave_type_id: 1, from_date, to_date, reason, file };
      console.log(req.body);
      console.log(data);
  
      // Check if a duplicate entry exists
      const existingLeave = await db.select("leave_applications_new", "*", [`userid = '${user_id}'`, `from_date = '${from_date}'`, `to_date = '${to_date}'`], "AND");
      if (existingLeave) return res.status(400).json({ error: "Leave already applied for these dates" });
  
      // Insert new leave application
      const result = await db.insert("public.leave_applications_new", data);
      res.status(200).json({ message: "Leave applied successfully", data: result });
    } catch (error) {
      console.error("Error applying leave:", error);
      res.status(500).json({ error: "Server error while submitting leave" });
    }
  });

// Update leave status
router.put("/update-leave-status/:id", async (req, res) => {
    const { id } = req.params;
    const { status, reject_reason } = req.body;
    try {
        const result = await db.update('public.leave_applications', { status, reject_reason }, { id });
        return res.status(200).json({ response: 'Success', data: result });
    } catch (err) {
        console.error('Error updating leave status:', err);
        return res.status(500).json({ response: 'Error', message: err.message });
    }
});

// Delete leave application
router.delete("/delete-leave/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.delete('public.leave_applications', { id });
        return res.status(200).json({ response: 'Success', data: result });
    } catch (err) {
        console.error('Error deleting leave application:', err);
        return res.status(500).json({ response: 'Error', message: err.message });
    }
});

module.exports = router;


