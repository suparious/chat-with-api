const express = require('express');
const router = express.Router();
const { processQuery, queryEconomicData } = require('../utils/nlpProcessor');
const { getCachedData, saveToCache } = require('../utils/cacheManager');
const { generateChart } = require('../utils/chartGenerator');
const { isAuthenticated } = require('./middleware/authMiddleware');
const { saveQueryResult } = require('../utils/fileGenerator');
const fs = require('fs');
const path = require('path');

router.post('/query', isAuthenticated, async (req, res) => {
  try {
    const userQuery = req.body.query;
    if (!userQuery) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const processedQuery = await processQuery(userQuery);

    // Revised error handling for processed query indicating a lack of real-time data
    if (processedQuery.includes("I do not have access to real-time data")) {
      return res.status(200).json({
        message: "The AI does not have access to real-time data. Please refine your query to request historical data or statistics."
      });
    }

    let data = await getCachedData(processedQuery);
    if (!data) {
      data = await queryEconomicData(processedQuery);
      await saveToCache(processedQuery, data);
    }

    let chartPath = null;
    if (data && typeof data.chartRequested !== 'undefined' && data.chartRequested) {
      const filePath = await generateChart(data.chartData, data.chartType, data.chartOptions || {});
      chartPath = `/downloads/${path.basename(filePath)}`;
    }

    res.json({
      query: processedQuery,
      data: data,
      chart: chartPath,
      status: "REQUEST_SUCCEEDED",
    });
  } catch (error) {
    console.error('API Query Error:', error);
    console.error('Error stack:', error.stack);
    // Specific error handling for real-time data limitations restored
    if (error.message.includes("limitations in accessing real-time data") || error.message.includes("Invalid Request - Invalid Parameters")) {
      res.status(400).json({
        status: "REQUEST_FAILED",
        error: 'Query cannot be processed due to limitations in accessing real-time data or invalid parameters.',
        details: error.message,
      });
    } else {
      res.status(500).json({
        status: "REQUEST_FAILED",
        error: 'An unexpected error occurred while processing your query.',
        details: error.message,
      });
    }
  }
});

router.get('/query-interface', isAuthenticated, (req, res) => {
  try {
    res.render('query-interface');
    console.log('Rendering query-interface page for the user.');
  } catch (error) {
    console.error('Error rendering query-interface page:', error);
    console.error('Error stack:', error.stack);
    res.status(500).send('Error rendering the page.');
  }
});

router.post('/download-result', isAuthenticated, async (req, res) => {
  try {
    const { format, data } = req.body;
    if (!format || !data) {
      return res.status(400).json({ error: 'Format and data are required' });
    }

    const filePath = await saveQueryResult(data, format);
    const fileName = path.basename(filePath);

    // Set headers for file download
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('File download error:', err);
        console.error('Error stack:', err.stack);
        return res.status(500).send('Error downloading the file.');
      }
    });
  } catch (error) {
    console.error('Download-result error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      status: "REQUEST_FAILED",
      error: 'Internal Server Error',
      details: error.message,
    });
  }
});

module.exports = router;