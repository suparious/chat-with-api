const axios = require('axios');
require('dotenv').config(); // Ensure dotenv is required to access environment variables

// Function to fetch data from the Bureau of Economic Analysis (BEA) API
async function fetchDataFromBEA(queryParams) {
  try {
    if (queryParams.hasOwnProperty('keyword')) {
      queryParams.keyword = queryParams.keyword.replace(/\s+/g, ' ').trim();
    }
    queryParams.UserID = process.env.BEA_API_KEY;
    console.log('Fetching data from BEA API with params:', queryParams);
    const response = await axios.get('https://apps.bea.gov/api/data/', { params: queryParams });
    if (response.data.BEAAPI.Results.Error) {
      throw new Error(`BEA API Error: ${response.data.BEAAPI.Results.Error['@APIErrorDescription']}`);
    }
    console.log('Successfully fetched data from BEA API.');
    return response.data;
  } catch (error) {
    console.error('Error fetching data from BEA API:', error.message);
    console.error('Request URL:', error.config.url);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

// Function to fetch data from the Bureau of Labour Statistics (BLS) API
async function fetchDataFromBLS(queryParams) {
  try {
    if (queryParams.hasOwnProperty('seriesId')) {
      queryParams.seriesId = queryParams.seriesId.replace(/\s+/g, '').trim(); // Remove all spaces and trim
    }
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      seriesId: queryParams.seriesId.split(','), // Adjusted to send seriesId as an array
      registrationKey: process.env.BLS_API_KEY
    };
    console.log('Fetching data from BLS API with params:', body);
    const response = await axios.post('https://api.bls.gov/publicAPI/v2/timeseries/data/', body, { headers });
    if (response.data.Results && response.data.Results.hasOwnProperty('error') && response.data.Results.error) {
      throw new Error(`BLS API Error: ${response.data.Results.error}`);
    }
    console.log('Successfully fetched data from BLS API.');
    return response.data;
  } catch (error) {
    console.error('Error fetching data from BLS API:', error.message);
    console.error('Request URL:', error.config.url);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

// Function to fetch data from the US Census Bureau API
async function fetchDataFromCensus(queryParams) {
  try {
    if (queryParams.hasOwnProperty('get')) {
      queryParams.get = queryParams.get.replace(/\s+/g, ',').trim();
    }
    queryParams.key = process.env.CENSUS_API_KEY;
    console.log('Fetching data from US Census Bureau API with params:', queryParams);
    const response = await axios.get('https://api.census.gov/data/', { params: queryParams });
    if (response.data.error) {
      throw new Error(`Census API Error: ${response.data.error}`);
    }
    console.log('Successfully fetched data from US Census Bureau API.');
    return response.data;
  } catch (error) {
    console.error('Error fetching data from US Census Bureau API:', error.message);
    console.error('Request URL:', error.config.url);
    console.error('Error stack:', error.stack);
    throw error;
  }
}

module.exports = {
  fetchDataFromBEA,
  fetchDataFromBLS,
  fetchDataFromCensus
};