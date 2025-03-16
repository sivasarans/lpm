const pool = require('../config/db');

const User = {

  async findByUserId(user_id) {
    const query = 'SELECT * FROM users WHERE user_id = $1';
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  },

  async createUser(userData) {
    const query = `
      INSERT INTO Users (name, email, user_id, role_name, password, profile_picture, gender, joining_date, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`;
    const values = [
      userData.name,
      userData.email,
      userData.user_id,
      userData.role_name,
      userData.password,
      userData.profile_picture,
      userData.gender,
      userData.joining_date,
      userData.status,
    ];
    return pool.query(query, values);
  },

  async getAllUsers() {
    const query = 'SELECT * FROM Users';
    return pool.query(query);
  },

  async updateUser(user_id, userData) {
    const query = `
      UPDATE Users
      SET name = $1, email = $2, role_name = $3, password = $4,
          gender = $5, joining_date = $6, status = $7,
          profile_picture = COALESCE($8, profile_picture)
      WHERE user_id = $9 RETURNING id`;
    const values = [
      userData.name,
      userData.email,
      userData.role_name,
      userData.password,
      userData.gender,
      userData.joining_date,
      userData.status,
      userData.profile_picture,
      user_id,
    ];
    return pool.query(query, values);
  },

  async deleteUser(user_id) {
    const query = 'DELETE FROM Users WHERE user_id = $1 RETURNING id';
    return pool.query(query, [user_id]);
  },

  async userExists(user_id) {
    const query = 'SELECT 1 FROM Users WHERE user_id = $1';
    return pool.query(query, [user_id]);
  },
};

module.exports = User;