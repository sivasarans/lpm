const User = require('../model/userModel');

const userController = {
  async createUser(req, res) {
    const {
      name,
      email,
      user_id,
      role_name,
      password,
      gender,
      joining_date,
      status,
    } = req.body;

    if (
      !name ||
      !email ||
      !user_id ||
      !role_name ||
      !password ||
      !gender ||
      !joining_date ||
      !status ||
      !req.file
    ) {
      console.log('Validation failed: Missing required fields...');
      return res.status(400).json({ error: 'All fields and profile picture are required' });
    }

    try {
      console.log('Checking if user ID already exists...');
      const userExists = await User.userExists(user_id);
      if (userExists.rows.length > 0) {
        console.log(`User ID ${user_id} already exists.`);
        return res.status(400).json({ error: 'User ID already exists' });
      }

      const userData = {
        name,
        email,
        user_id,
        role_name,
        password,
        profile_picture: `/uploads/users_profile/${req.file.filename}`,
        gender,
        joining_date,
        status,
      };

      console.log('Inserting new user into database...');
      const result = await User.createUser(userData);

      console.log('User added successfully:', result.rows[0]);
      res.status(200).json({ message: 'User added successfully', userId: result.rows[0].id });
    } catch (err) {
      console.error('Error adding user:', err);
      res.status(500).json({ error: 'Failed to process request' });
    }
  },

  async getAllUsers(req, res) {
    try {
      const result = await User.getAllUsers();
      res.status(200).json({ message: 'Success', result: result.rows });
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(400).json({ message: 'Failed to fetch users' });
    }
  },

  async updateUser(req, res) {
    const {
      name,
      email,
      role_name,
      password,
      gender,
      joining_date,
      status,
    } = req.body;
    const { user_id } = req.params;
    const profile_picture = req.file ? `/uploads/users_profile/${req.file.filename}` : null;

    if (
      !name ||
      !email ||
      !role_name ||
      !password ||
      !gender ||
      !joining_date ||
      !status
    ) {
      console.log('Validation failed: Missing required fields.');
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      console.log(`Checking if user ID ${user_id} exists...`);
      const userExists = await User.userExists(user_id);
      if (userExists.rows.length === 0) {
        console.log(`User ID ${user_id} not found.`);
        return res.status(404).json({ error: 'User not found' });
      }

      const userData = {
        name,
        email,
        role_name,
        password,
        gender,
        joining_date,
        status,
        profile_picture,
      };

      console.log(`Updating user with ID ${user_id}...`);
      const result = await User.updateUser(user_id, userData);

      if (result.rowCount === 0) {
        console.log('Failed to update user.');
        return res.status(400).json({ error: 'Failed to update user' });
      }

      console.log('User updated successfully:', result.rows[0]);
      res.status(200).json({ message: 'User updated successfully', userId: result.rows[0].id });
    } catch (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ error: 'Failed to process request' });
    }
  },

  async deleteUser(req, res) {
    const { user_id } = req.params;

    try {
      console.log(`Checking if user ID ${user_id} exists...`);
      const userExists = await User.userExists(user_id);
      if (userExists.rows.length === 0) {
        console.log(`User ID ${user_id} not found.`);
        return res.status(404).json({ error: 'User not found' });
      }

      console.log(`Deleting user with ID ${user_id}...`);
      const result = await User.deleteUser(user_id);

      if (result.rowCount === 0) {
        console.log('Failed to delete user.');
        return res.status(400).json({ error: 'Failed to delete user' });
      }

      console.log('User deleted successfully:', result.rows[0]);
      res.status(200).json({ message: 'User deleted successfully', userId: result.rows[0].id });
    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: 'Failed to process request' });
    }
  },
};

module.exports = userController;