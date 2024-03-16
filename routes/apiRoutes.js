const express = require('express');
const router = express.Router();
const { processQuery, queryEconomicData } = require('../utils/nlpProcessor');
const { getCachedData, saveToCache } = require('../utils/cacheManager');
const { generateChart } = require('../utils/chartGenerator');
const { isAuthenticated } = require('./middleware/authMiddleware');
const { saveQueryResult } = require('../utils/fileGenerator');
const { handleApiError } = require('../utils/errorHandler');
const fs = require('fs');
const path = require('path');

router.post('/query', isAuthenticated, async (req, res) => {
  try {
    const userQuery = req.body.query;
    if (!userQuery) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const processedQuery = await processQuery(userQuery);

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

    if (!data || (data && !data.data)) {
      res.status(200).json({
        query: processedQuery,
        message: "No specific data found for your query.",
        status: "REQUEST_SUCCEEDED_NO_DATA",
      });
    } else {
      res.json({
        query: processedQuery,
        data: data,
        chart: chartPath,
        status: "REQUEST_SUCCEEDED",
      });
    }
  } catch (error) {
    console.error('API Query Error:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);

    // Custom error handling for specific scenarios
    let customMessage = '';
    if (error.message.includes("limitations in accessing real-time data")) {
      customMessage = 'Query cannot be processed due to limitations in accessing real-time data.';
    } else if (error.message.includes("Invalid Request - Invalid Parameters")) {
      customMessage = 'The request contains invalid parameters.';
    }

    const { status, message } = handleApiError(error, 'An unexpected error occurred while processing your query.');

    res.status(status).json({
      status: "REQUEST_FAILED",
      error: customMessage || message,
      details: customMessage ? error.message : undefined
    });
  }
});

router.get('/query-interface', isAuthenticated, (req, res) => {
  try {
    res.render('query-interface');
    console.log('Rendering query-interface page for the user.');
  } catch (error) {
    console.error('Error rendering query-interface page:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);
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

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('File download error:', err.message);
        console.error('Error stack:', err.stack);
        console.error('Full error:', err);
        return res.status(500).send('Error downloading the file.');
      }
    });
  } catch (error) {
    console.error('Download-result error:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);
    res.status(500).json({
      status: "REQUEST_FAILED",
      error: 'Internal Server Error',
      details: error.message,
    });
  }
});

module.exports = router;