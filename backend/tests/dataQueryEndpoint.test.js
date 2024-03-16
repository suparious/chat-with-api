const request = require('supertest');
const app = require('../server'); // Assume this is the express app instance

describe('POST /api/data/query', () => {
  it('fetches data successfully', async () => {
    const response = await request(app).post('/api/data/query').send({ query: 'GDP growth' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('result'); // Assuming the response has a 'result' property
    console.log('Data fetched successfully for query: GDP growth');
  });

  it('handles errors correctly', async () => {
    const response = await request(app).post('/api/data/query').send({ query: 'invalid query' });
    expect(response.statusCode).toBe(400); // Assuming a 400 status code for bad requests
    expect(response.body).toHaveProperty('message');
    console.error('Error fetching data for query: invalid query', response.body.message);
  });
});