const request = require('supertest');
const app = require('../server'); // Assume this is the express app instance

describe('POST /api/data/query', () => {
  it('fetches data successfully', async () => {
    const response = await request(app).post('/api/data/query').send({ query: 'GDP growth' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data'); // Updated to reflect the expected response structure
    console.log('Data fetched successfully for query: GDP growth');
  });

  it('handles errors correctly', async () => {
    const response = await request(app).post('/api/data/query').send({ query: 'invalid query' });
    // Updated to reflect a more realistic status code for not found or invalid queries
    expect(response.statusCode).toBe(404); 
    expect(response.body).toHaveProperty('error');
    console.error('Error fetching data for query: invalid query', response.body.error, response.body.error.stack);
  });

  // Additional test to cover new API functionality or changes
  it('requires authentication', async () => {
    const response = await request(app).post('/api/data/query').send({ query: 'interest rates' });
    // Assuming a 401 status code for unauthenticated requests
    expect(response.statusCode).toBe(401); 
    expect(response.body).toHaveProperty('message');
    console.log('Authentication required for fetching data for query: interest rates');
  });
});