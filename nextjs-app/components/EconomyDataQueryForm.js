import React, { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '../context/QueryContext'; // Import the useQuery hook
import ProgressIndicator from './ProgressIndicator'; // Import the ProgressIndicator component
import { API_ENDPOINTS } from '../utils/apiConfig'; // Import the API configuration

function EconomyDataQueryForm() {
  const { query, setQuery, results, setResults, error, setError, loading, setLoading } = useQuery(); // Use the context

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      setError('You must be logged in to perform queries.');
      setLoading(false); // Ensure loading is set to false if not authenticated
    }
  }, [setError, setLoading]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setResults(null);
    setLoading(true); // Use the context to set loading

    try {
      const response = await axios.post(API_ENDPOINTS.queryData, { query }, { withCredentials: true });
      setResults(response.data); // Use the context to set results
      console.log('Data fetched successfully:', response.data);
    } catch (err) {
      console.error('Error fetching data:', err.response ? err.response.data.message : 'Failed to fetch data. Please try again.', err);
      console.error('Error trace:', err.stack);
      setError(err.response ? err.response.data.message : 'Failed to fetch data. Please try again.'); // Use the context to set error
    } finally {
      setLoading(false); // Use the context to reset loading
    }
  };

  return (
    <div>
      <ProgressIndicator show={loading} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="queryInput">Enter your query:</label>
        <input
          id="queryInput"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., 'What is the current unemployment rate?'"
          required
        />
        <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Submit'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {results && (
        <div>
          <h2>Query Results:</h2>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default EconomyDataQueryForm;