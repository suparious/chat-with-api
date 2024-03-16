// utils/nlpProcessor.js

const openai = require("openai").default;
const { fetchDataFromBEA, fetchDataFromBLS, fetchDataFromCensus } = require('./dataFetchers');
require("dotenv").config();

const openAIClient = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

async function processQuery(userQuery) {
  try {
    console.log(`Original user query: ${userQuery}`);
    // Update to include function calling if supported by the model
    const response = await openAIClient.createCompletion({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      prompt: userQuery,
      temperature: 0.5,
      max_tokens: 100,
      n: 1,
      stop: null,
      // Assuming the function calling syntax is as per OpenAI's documentation for the updated model
      user: "application_user",
      system: "economy_data_retrieval",
      function: "process_economic_query",
    });

    const processedQuery = response.choices[0].text.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');

    console.log(`Processed query: ${processedQuery}`);
    return processedQuery;
  } catch (error) {
    console.error(`Error processing query with OpenAI: ${error.message}`);
    console.error('Error details:', error.stack);
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