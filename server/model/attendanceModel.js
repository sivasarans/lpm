const PGSDB = require('../library/pgsdb'); // Import the class
const db = new PGSDB(); // Create instance
const Attendance = {
  async getAllUsers() {
    const query = 'SELECT id, name, user_id, role_name FROM Users';
    return db.raw(query);
  },

  async getAttendanceByDate(date) {
    const query = 'SELECT *, updated_at FROM Attendance WHERE date = $1';
    return db.raw(query, [date]);
  },

  async getAttendanceByUserAndDate(userId, date) {
    const query = 'SELECT * FROM Attendance WHERE user_id = $1 AND date = $2';
    return db.raw(query, [userId, date]);
  },

  async updateAttendance(userId, date, inTime, outTime) {
    const query = `
      UPDATE Attendance 
      SET in_time = $1, out_time = $2, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = $3 AND date = $4`;
    return db.raw(query, [inTime, outTime, userId, date]);
  },

  async insertAttendance(userId, name, date, inTime, outTime) {
    const query = `
      INSERT INTO Attendance (user_id, name, date, in_time, out_time) 
      VALUES ($1, $2, $3, $4, $5)`;
    return db.raw(query, [userId, name, date, inTime, outTime]);
  },
};

module.exports = Attendance;
