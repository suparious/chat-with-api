import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Layout from '../components/Layout';
import axios from 'axios';

function Charts() {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchChartData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/chart-data');
      if (response.data && response.data.labels && response.data.values) {
        setChartData({
          labels: response.data.labels,
          datasets: [
            {
              label: response.data.label,
              data: response.data.values,
              fill: false,
              backgroundColor: 'rgb(75, 192, 192)',
              borderColor: 'rgba(75, 192, 192, 0.2)',
            },
          ],
        });
        console.log('Chart data fetched successfully');
      } else {
        console.log('No chart data available');
        setError('No chart data available');
      }
    } catch (error) {
      console.error('Error fetching chart data:', error.message);
      console.error('Error trace:', error.stack);
      setError('Failed to fetch chart data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <Layout>
      <h2>Chart Visualization</h2>
      {loading && <p>Loading chart data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {chartData.labels && <Line data={chartData} />}
    </Layout>
  );
}

export default Charts;