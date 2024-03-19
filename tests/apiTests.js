const chai = require('chai');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const expect = chai.expect;

describe('API Tests', () => {
  it('should return data for valid query', async () => {
    const response = await axios.post('http://localhost:3000/api/query', {
      query: 'What is the GDP of the United States?',
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('object');
    expect(response.data.query).to.equal('What is the GDP of the United States?');
    expect(response.data.data).to.be.an('object');
  });

  it('should return error for missing query', async () => {
    try {
      await axios.post('http://localhost:3000/api/query', {});
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property('error');
    }
  });

  it('should download result in CSV format', async () => {
    const response = await axios.post('http://localhost:3000/api/download-result', {
      format: 'csv',
      data: { key: 'value' }, // Example data for testing
    });

    expect(response.status).to.equal(200);
    expect(response.headers['content-type']).to.equal('text/csv');
  });

  it('should return error for missing data or format', async () => {
    try {
      await axios.post('http://localhost:3000/api/download-result', {});
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property('error');
    }
  });
});