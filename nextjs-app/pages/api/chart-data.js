import axios from 'axios';

export default async function handler(req, res) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = process.env.NEXT_PUBLIC_API_AUTH_TOKEN; 
  try {
    console.log(`Requesting chart data from ${backendUrl}/api/chart-data`);
    const response = await axios.get(`${backendUrl}/api/chart-data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Chart data fetched successfully');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Failed to fetch chart data from backend:', error.message);
    console.error('Error stack:', error.stack);
    res.status(error.response ? error.response.status : 500).json({ error: 'Failed to fetch chart data' });
  }
}