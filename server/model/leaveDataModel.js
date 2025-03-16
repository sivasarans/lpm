const pool = require('../config/db');
// const db = require("../config/postgresql")
const PGSDB = require('../library/pgsdb'); // Import the class
const db = new PGSDB(); // Create instance
const nodemailer = require('nodemailer');




const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'xvamtec@gmail.com',
    pass: 'asnw flum kvgf kvhu' // Consider using environment variables
  }
});
// Updated method using PGSDB class

const LeaveData = {
  async getAllLeaveApplications() {
    const res = await db.raw('SELECT * FROM leave_applications');    // console.log('Raw query result:', res); // Should show data
    return res;
  },

  async getAllLeaveData() { 

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
  // --------------------use this if apply fails --------------------
  // async applyLeave(leaveApplication) {
  //   const query = `
  //     INSERT INTO leave_applications 
  //       (user_id, user_name, leave_type, from_date, to_date, 
  //        leave_days, reason, file, status)
  //     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending')
  //     RETURNING *`;
    
  //   const values = [
  //     leaveApplication.user_id, leaveApplication.user_name,
  //     leaveApplication.leave_type, leaveApplication.from_date,
  //     leaveApplication.to_date, leaveApplication.leave_days,
  //     leaveApplication.reason, leaveApplication.file
  //   ];
    
  //   return db.raw(query, values);
  // },


  
  async applyLeave(leaveApplication) {
    const query = `
      INSERT INTO leave_applications 
        (user_id, user_name, leave_type, from_date, to_date, 
         leave_days, reason, file, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending')
      RETURNING *`;
    
    const values = [
      leaveApplication.user_id, 
      leaveApplication.user_name,
      leaveApplication.leave_type, 
      leaveApplication.from_date,
      leaveApplication.to_date, 
      leaveApplication.leave_days,
      leaveApplication.reason, 
      leaveApplication.file
    ];
    
    try {
      // Insert leave application
      const result = await db.raw(query, values);
      // console.log("result:",result[0]);
      const newLeave = result
      const formatDate = (date) => {
        const d = new Date(date);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${d.getDate()} - ${months[d.getMonth()]} - ${d.getFullYear()}`;
      };
      const leaveTypes = [
        { value: 1, short: 'EL', full: 'Earned Leave' },
        { value: 2, short: 'SL', full: 'Sick Leave' },
        { value: 3, short: 'CL', full: 'Casual Leave' },
        { value: 4, short: 'CO', full: 'Compensatory Off' },
        { value: 5, short: 'SO', full: 'Special Occasion Leave' },
        { value: 6, short: 'SML', full: 'Short Maternity Leave' },
        { value: 7, short: 'ML', full: 'Maternity Leave' },
        { value: 8, short: 'CW', full: 'Childcare Work Leave' },
        { value: 9, short: 'OOD', full: 'On Official Duty' },
        { value: 10, short: 'COL', full: 'Compensatory Off Leave' },
        { value: 11, short: 'WFH', full: 'Work From Home' },
        { value: 12, short: 'WO', full: 'Weekly Off' },
        { value: 13, short: 'MP', full: 'Marriage Permission' },
        { value: 14, short: 'PL', full: 'Paternity Leave' },
      ];
      // const leaveType = leaveTypes.find(lt => lt.value === newLeave[0]?.leave_type);
      // const fullLeaveType = leaveType?.full || 'Unknown Leave Type';
      const leaveType = leaveTypes.find(lt => Number(lt.value) === Number(newLeave[0]?.leave_type));
      const fullLeaveType = leaveType?.full || `Unknown Leave Type (${newLeave[0]?.leave_type || "N/A"})`;

    const mailOptions = {
      from: 'xvamtec@gmail.com',
      to: 'milkymistofficial@gmail.com'.trim(),
      subject: '📌 Leave Application Submitted Successfully!',
      html: `
        <div style="font-family: Arial, sans-serif; border: 2px solid #4CAF50; padding: 20px; border-radius: 10px; background: #f9f9f9; max-width: 600px;">
          <h2 style="color: #4CAF50; text-align: center;">✅ Leave Application Submitted</h2>
          <p style="font-size: 16px; color: #333;">
            Dear <b>${newLeave[0]?.user_name}</b>,<br><br>
            Your leave application has been submitted successfully and is under review. Below are the details:
          </p>
    
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="background: #4CAF50; color: white;">
              <th style="padding: 10px; text-align: left;">Detail</th>
              <th style="padding: 10px; text-align: left;">Information</th>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><b>Leave Type:</b></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${fullLeaveType}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><b>From:</b></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${formatDate(newLeave[0]?.from_date)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><b>To:</b></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${formatDate(newLeave[0]?.to_date)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><b>Reason:</b></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${newLeave[0]?.reason}</td>
            </tr>
          </table>
    
          <p style="font-size: 16px; color: #333; margin-top: 15px;">
            📢 We will notify you once your request has been reviewed.<br>
            <br>Best regards,<br>
            <b>HR Team</b>  
          </p>
        </div>
      `
    };
    
      
  
      // Send email notification
      await transporter.sendMail(mailOptions);
      console.log('Leave application submitted and notification sent');
  
      return newLeave;
    } catch (error) {
      console.error('Error in leave application process:', error);
      throw error; // Or handle error as per your error handling strategy
    }
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

  async updateLeaveStatus(id, status, remarks, approved_by) {
    const query = `
      UPDATE leave_applications 
      SET 
        status = $1, 
        remarks = COALESCE($2, 'default-x'), 
        approved_by = $3,
        approved_date = CASE WHEN LOWER($1) = 'approved' THEN NOW() ELSE approved_date END
      WHERE id = $4 
      RETURNING *`;
  
    const result = await db.raw(query, [status, remarks, approved_by, id]);
    // console.log('Update Result:', result[0]); // Debug log
    return result;
  }
  
  
,  
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