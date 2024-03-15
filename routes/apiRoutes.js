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

    if (processedQuery.includes("I do not have real-time data capabilities")) {
      throw new Error("The query cannot be processed due to limitations in accessing real-time data.");
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
    if (error.message.includes("limitations in accessing real-time data")) {
      res.status(400).json({
        status: "REQUEST_FAILED",
        error: 'Query cannot be processed due to limitations in accessing real-time data.',
        details: error.message,
      });
    } else {
      res.status(500).json({
        status: "REQUEST_FAILED",
        error: 'Internal Server Error',
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