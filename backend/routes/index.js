const express = require('express');
const router = express.Router();
// Example of route-specific CORS configuration
//const cors = require('cors');
//
//const customCorsOptions = {
//  origin: 'https://example.com',
//  credentials: true,
//};
//router.get('/api/special-endpoint', cors(customCorsOptions), (req, res) => {
//  // Route logic here
//});

// Welcome info endpoint
router.get('/api/welcome-info', (req, res) => {
  console.log('Fetching welcome info');
  res.json({
    message: 'Welcome to Chat_with_USA_Economy_Data! This innovative application provides access to the most accurate live data on the US economy.',
    appDescription: 'Through a Natural Language Processing (NLP) interface, users can query various public APIs for datasets related to the United States\' economy, including information from the Bureau of Economic Analysis, Bureau of Labour Statistics, and the US Census Bureau.'
  });
});

module.exports = router;