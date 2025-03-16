const User = require('../model/userModel');
// const jwt = require('jsonwebtoken');


const loginController = {
  async login(req, res) {
    const { user_id, password } = req.body;

    if (!user_id || !password) {
      return res.status(400).json({ error: 'User_id and password are required' });
    }

    try {
      const user = await User.findByUserId(user_id);

      if (!user) {
        return res.status(401).json({ error: 'Invalid User_id. Please check and try again.' });
      }

      if (user.password !== password) {
        return res.status(401).json({ error: 'Incorrect password. Please check and try again.' });
      }

      res.status(200).json({
        message: 'Login successful',
        user: { 
          id: user.id,
          name: user.name,
          role: user.role_name,
          user_id: user_id,
          email: user.email,
          profile_picture: user.profile_picture,
        },
        // token,
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
  }
};

module.exports = loginController;