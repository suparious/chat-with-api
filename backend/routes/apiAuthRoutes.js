const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for JWT handling
const router = express.Router();
const User = require('../models/User');

// Welcome info endpoint
router.get('/', (req, res) => {
  console.log('Fetching apiAuthRoutes info');
  res.json({
    message: 'This is the apiAuthRoutes',
    appDescription: 'apiAuthRoutes'
  });
});

// User registration
router.post('/register', async (req, res) => {
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
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      message: 'Logged in successfully',
      token: 'Bearer ' + token
    });
  } catch (error) {
    console.error('Error during login:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// User logout
// Since JWT is stateless, logging out is handled client-side by deleting the stored token
router.post('/logout', (req, res) => {
  console.log('User initiated logout. Since JWT is stateless, no action is required server-side.');
  res.status(200).json({ message: 'Logout successful. Remember to clear your JWT token client-side.' });
});

module.exports = router;