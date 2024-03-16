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
      keyword: query // This is an example parameter, adjust as necessary
    }).catch(err => {
      console.error('Error fetching data from BEA:', err.message);
      console.error(err.stack);
      throw new Error('Failed to fetch data from BEA API');
    });

    // Fetch data from BLS
    const blsData = await fetchDataFromBLS({
      seriesId: query // This is an example parameter, adjust as necessary
    }).catch(err => {
      console.error('Error fetching data from BLS:', err.message);
      console.error(err.stack);
      throw new Error('Failed to fetch data from BLS API');
    });

    // Fetch data from Census
    const censusData = await fetchDataFromCensus({
      get: 'POP', // Example parameter for population data
      for: 'state:*' // Fetching data for all states, adjust as necessary
    }).catch(err => {
      console.error('Error fetching data from Census:', err.message);
      console.error(err.stack);
      throw new Error('Failed to fetch data from Census API');
    });

    // Combine and format the fetched data as necessary
    const combinedData = {
      bea: beaData,
      bls: blsData,
      census: censusData
    };

    console.log('Combined data successfully fetched from all APIs.');
    res.json(combinedData); // Send the combined data as response
  } catch (error) {
    console.error('Failed to process query:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to process query due to an error fetching data from external APIs.' });
  }
});

module.exports = router;