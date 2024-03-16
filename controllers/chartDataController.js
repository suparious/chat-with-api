const axios = require('axios');
const { BEA_API_KEY, BLS_API_KEY, CENSUS_API_KEY } = process.env;

// Dynamically fetch data from BEA API
async function fetchDataFromBEA(params) {
    try {
        const response = await axios.get('https://apps.bea.gov/api/data/', {
            params: {
                UserID: BEA_API_KEY,
                ...params,
            },
        });
        console.log('Successfully fetched data from BEA API');
        return response.data;
    } catch (error) {
        console.error('Error fetching data from BEA API:', error.message);
        console.error(error.stack);
        throw error;
    }
}

// Dynamically fetch data from BLS API
async function fetchDataFromBLS(params) {
    try {
        const response = await axios.post('https://api.bls.gov/publicAPI/v2/timeseries/data/', {
            ...params,
            registrationkey: BLS_API_KEY,
        });
        console.log('Successfully fetched data from BLS API');
        return response.data;
    } catch (error) {
        console.error('Error fetching data from BLS API:', error.message);
        console.error(error.stack);
        throw error;
    }
}

// Dynamically fetch data from the US Census Bureau API
async function fetchDataFromCensus(params) {
    try {
        const response = await axios.get('https://api.census.gov/data/2021/pep/population', {
            params: {
                ...params,
                key: CENSUS_API_KEY,
            },
        });
        console.log('Successfully fetched data from US Census Bureau API');
        return response.data;
    } catch (error) {
        console.error('Error fetching data from US Census Bureau API:', error.message);
        console.error(error.stack);
        throw error;
    }
}

// Main controller function to aggregate data from multiple sources and format it for chart generation
exports.getChartData = async (req, res) => {
    try {
        const beaData = await fetchDataFromBEA(req.query.beaParams || {});
        const blsData = await fetchDataFromBLS(req.query.blsParams || {});
        const censusData = await fetchDataFromCensus(req.query.censusParams || {});

        // Example of processing and combining data from multiple sources
        const combinedData = {
            beaData: beaData,
            blsData: blsData,
            censusData: censusData,
        };

        console.log('Successfully combined data from BEA, BLS, and Census APIs');
        res.json(combinedData);
    } catch (error) {
        console.error('Error combining data from APIs:', error.message);
        console.error(error.stack);
        res.status(500).send('Failed to fetch chart data');
    }
};