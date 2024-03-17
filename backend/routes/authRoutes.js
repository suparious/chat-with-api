``` 
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for JWT handling
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
    req.logIn(user, { session: false }, (err) => { // Properly disable session for JWT
      if (err) {
        console.error('Server error during JWT token creation:', err);
        console.error('Error stack:', err.stack);
        return res.status(500).json({ message: 'Server error during JWT token creation' });
      }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({
        message: 'Logged in successfully',
        token: 'Bearer ' + token
      });
    });
  })(req, res, next);
});

// User logout
router.get('/api/auth/logout', (req, res) => {
  // Note: Since JWT is stateless, this route simply informs the client to delete the stored token
  console.log('User initiated logout');
  res.status(200).json({ message: 'Please clear your JWT token client-side to log out successfully.' });
});

module.exports = router;