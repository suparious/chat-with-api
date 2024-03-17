const express = require('express');
const router = express.Router();
const cors = require('cors');

// Configuring CORS
const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,
};

router.use(cors(corsOptions));

// Welcome info endpoint
router.get('/api/welcome-info', (req, res) => {
  console.log('Fetching welcome info');
  res.json({
    message: 'Welcome to Chat_with_USA_Economy_Data! This innovative application provides access to the most accurate live data on the US economy.',
    appDescription: 'Through a Natural Language Processing (NLP) interface, users can query various public APIs for datasets related to the United States\' economy, including information from the Bureau of Economic Analysis, Bureau of Labour Statistics, and the US Census Bureau.'
  });
});

module.exports = router;