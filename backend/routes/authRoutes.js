const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

// User registration
router.post('/api/auth/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    user = new User({
      username,
      email,
      password: hashedPassword
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// User login
router.post('/api/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Server error during authentication:', err);
      console.error('Error stack:', err.stack);
      return res.status(500).json({ message: 'Server error during authentication' });
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, err => {
      if (err) {
        console.error('Server error during session creation:', err);
        console.error('Error stack:', err.stack);
        return res.status(500).json({ message: 'Server error during session creation' });
      }
      return res.status(200).json({ message: 'Logged in successfully' });
    });
  })(req, res, next);
});

// User logout
router.get('/api/auth/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      console.error('Error during session destruction:', err);
      console.error('Error stack:', err.stack);
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;