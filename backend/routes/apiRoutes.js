const express = require('express');
const router = express.Router();
const { fetchDataFromBEA, fetchDataFromBLS, fetchDataFromCensus } = require('../utils/dataFetchers');
const isAuthenticated = require('../middlewares/authMiddleware');

router.post('/data/query', isAuthenticated, async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    // Fetch data from BEA
    const beaData = await fetchDataFromBEA({
      // Replace the placeholder with actual parameters required by the BEA API
      keyword: query // This is an example parameter, adjust as necessary
    });

    // Fetch data from BLS
    const blsData = await fetchDataFromBLS({
      // Replace the placeholder with actual parameters required by the BLS API
      seriesId: query // This is an example parameter, adjust as necessary
    });

    // Fetch data from Census
    const censusData = await fetchDataFromCensus({
      // Replace the placeholder with actual parameters required by the Census API
      get: 'POP', // Example parameter for population data
      for: 'state:*' // Fetching data for all states, adjust as necessary
    });

    // Combine and format the fetched data as necessary
    const combinedData = {
      bea: beaData,
      bls: blsData,
      census: censusData
    };

    res.json(combinedData); // Send the combined data as response
  } catch (error) {
    console.error('Failed to process query:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to process query due to an error fetching data from external APIs.' });
  }
});

module.exports = router;