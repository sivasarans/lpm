const Attendance = require('../model/attendanceModel');

const attendanceController = {
  async getAllUsers(req, res) {
    try {
      const result = await Attendance.getAllUsers();
      const rows = result.rows || result; // in case db.raw returns just array
      if (rows.length > 0) {
        res.status(200).json({ success: true, users: rows });
      } else {
        res.status(404).json({ success: false, message: 'No users found.' });
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ success: false, message: 'Error fetching users.' });
    }
  },

  async bulkUpdateAttendance(req, res) {
    const attendanceData = req.body;

    if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Attendance data must be a non-empty array.',
      });
    }

    try {
      for (const record of attendanceData) {
        const { userId, name, date, inTime, outTime } = record;

        if (!userId || !date || !name) {
          throw new Error('Invalid attendance data.');
        }

        const result = await Attendance.getAttendanceByUserAndDate(userId, date);
        const rows = result.rows || result;

        if (rows.length > 0) {
          await Attendance.updateAttendance(
            userId,
            date,
            inTime || '09:30:00',
            outTime || '17:00:00'
          );
        } else {
          await Attendance.insertAttendance(
            userId,
            name,
            date,
            inTime || '09:30:00',
            outTime || '17:00:00'
          );
        }
      }

      res.status(200).json({
        success: true,
        message: 'Attendance updated successfully.',
      });
    } catch (err) {
      console.error('Error in bulk update:', err);
      res.status(500).json({
        success: false,
        message: 'Error updating attendance.',
      });
    }
  },

  async getAttendanceByDate(req, res) {
    const date = req.method === 'GET' ? req.query.date : req.body.date;

    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: 'Date is required.' });
    }

    try {
      const result = await Attendance.getAttendanceByDate(date);
      const rows = result.rows || result;
      if (rows.length > 0) {
        res.status(200).json({ success: true, attendance_date: rows });
      } else {
        res
          .status(404)
          .json({ success: false, message: 'No data found for this date.' });
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      res
        .status(500)
        .json({ success: false, message: 'Error fetching attendance.' });
    }
  },
};

module.exports = attendanceController;
