import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Layout from '../components/Layout';
import axios from 'axios';

function Charts() {
  const [chartData, setChartData] = useState({});

  const fetchChartData = async () => {
    try {
      const response = await axios.get('/api/chart-data');
      const data = response.data;
      setChartData({
        labels: data.labels,
        datasets: [
          {
            label: data.label,
            data: data.values,
            fill: false,
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      });
      console.log('Chart data fetched successfully');
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <Layout>
      <h2>Chart Visualization</h2>
      <Line data={chartData} />
    </Layout>
  );
}

export default Charts;