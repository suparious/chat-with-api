// utils/nlpProcessor.js

const OpenAI = require("openai");
const { fetchDataFromBEA, fetchDataFromBLS, fetchDataFromCensus } = require('./dataFetchers');
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function processQuery(userQuery) {
  try {
    console.log(`Original user query: ${userQuery}`);
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{
        role: "system",
        content: "You are a helpful assistant."
      }, {
        role: "user",
        content: userQuery
      }],
    });

    if (!response || !response.choices || response.choices.length === 0 || !response.choices[0].text) {
      console.error('No response or invalid response structure from OpenAI.');
      throw new Error('No response or invalid response structure from OpenAI.');
    }

    const processedQuery = typeof response.choices[0].text === 'string' ? response.choices[0].text.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ') : '';
    console.log(`Processed query: ${processedQuery}`);
    if (processedQuery === '') {
      throw new Error('Failed to process query. The response from OpenAI was not as expected.');
    }

    return processedQuery;
  } catch (error) {
    console.error(`Error processing query with OpenAI: ${error.message}`);
    console.error('Error details:', error);
    throw error;
  }
}

async function queryEconomicData(processedQuery) {
  const beaKeywords = ['gdp', 'gross domestic product', 'economic growth'];
  const blsKeywords = ['unemployment', 'employment', 'labor', 'job', 'wage', 'salary'];
  const censusKeywords = ['population', 'demographics', 'census'];

  let data;

  if (beaKeywords.some(keyword => processedQuery.toLowerCase().includes(keyword))) {
    console.log('Query contains BEA-related keywords. Fetching data from BEA API.');
    data = await fetchDataFromBEA({keyword: processedQuery});
  }
  else if (blsKeywords.some(keyword => processedQuery.toLowerCase().includes(keyword))) {
    console.log('Query contains BLS-related keywords. Determining appropriate seriesId for BLS API.');
    const seriesId = determineSeriesIdFromQuery(processedQuery);
    
    if (!seriesId) {
      console.log('Could not determine a valid BLS seriesId based on the query.');
      throw new Error('Could not determine a valid BLS seriesId based on the query.');
    }
    
    console.log(`Fetching data from BLS API using seriesId: ${seriesId}`);
    data = await fetchDataFromBLS({seriesId: seriesId});
  }
  else if (censusKeywords.some(keyword => processedQuery.toLowerCase().includes(keyword))) {
    console.log('Query contains Census-related keywords. Fetching data from Census API.');
    data = await fetchDataFromCensus({get: processedQuery});
  }
  else {
    console.log('Unable to determine the appropriate data source for the given query.');
    throw new Error('Unable to determine the appropriate data source for the given query.');
  }

  return data;
}

function determineSeriesIdFromQuery(query) {
  const mapping = {
    'unemployment': 'LNS14000000', // National Unemployment Rate
    'employment': 'CEU0000000001', // Total Employed
  };

  for (const [key, value] of Object.entries(mapping)) {
    if (query.includes(key)) {
      return value;
    }
  }

  return null;
}

module.exports = { processQuery, queryEconomicData };