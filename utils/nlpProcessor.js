const openai = require("openai").default;
const { fetchDataFromBEA, fetchDataFromBLS, fetchDataFromCensus } = require('./dataFetchers');
require("dotenv").config();

const openAIClient = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Processes a user's query using OpenAI's GPT-3.5-turbo model via Chat Completions.
 * @param {string} userQuery - The query input by the user.
 * @returns {Promise<string>} - The processed, understandable query for the APIs.
 */
async function processQuery(userQuery) {
  try {
    console.log(`Original user query: ${userQuery}`);
    const stream = await openAIClient.beta.chat.completions.stream({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userQuery }],
      stream: true,
    });

    let processedQuery = '';
    
    for await (const chunk of stream) {
      console.log('Receiving chunk from OpenAI stream...');
      if (chunk.choices[0]?.delta?.content) {
        processedQuery += chunk.choices[0].delta.content;
      }
    }

    const chatCompletion = await stream.finalChatCompletion();
    processedQuery = processedQuery.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');

    console.log(`Processed query: ${processedQuery}`);
    // Check if the processed query indicates a lack of real-time data access
    if (processedQuery.toLowerCase().includes("i do not have access to real-time data")) {
      // Inform the user directly that the AI cannot access real-time data and suggest checking official sources
      return "The AI cannot access real-time data directly. Please specify the type of economic data you're interested in, such as historical GDP growth rates or unemployment rates, which can be fetched from official sources.";
    }
    return processedQuery;
  } catch (error) {
    console.error(`Error processing query with OpenAI Chat Completions: ${error.message}`);
    console.error('Error details:', error.stack);
    throw error;
  }
}

/**
 * Decides which external API to use based on keywords in the processed query and fetches data.
 * @param {string} processedQuery - The query processed by NLP.
 * @returns {Promise<Object>} - Fetched data from the appropriate API.
 */
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

/**
 * Determines the BLS series ID based on the processed query.
 * @param {string} query - The processed query.
 * @returns {string|null} - The appropriate BLS series ID or null if not found.
 */
function determineSeriesIdFromQuery(query) {
  // Here, implement a more comprehensive and dynamic strategy to map the query to a series ID.
  // This could involve using NLP to understand the query better or having a more extensive mapping.
  // For demonstration, a simple mapping is used.

  const mapping = {
    'unemployment': 'LNS14000000', // National Unemployment Rate
    'employment': 'CEU0000000001', // Total Employed
    // More mappings can be added here based on expected user queries.
  };

  for (const [key, value] of Object.entries(mapping)) {
    if (query.includes(key)) {
      return value;
    }
  }

  return null;
}

module.exports = { processQuery, queryEconomicData };
