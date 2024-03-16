<<<<<<< HEAD
import { useState } from 'react';
import axios from 'axios';

function EconomyDataQueryForm() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Add a loading state

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setResults(null);
        setLoading(true); // Set loading to true before making the request

        try {
            const response = await axios.post('/api/data/query', { query }, { withCredentials: true });
            setResults(response.data);
            console.log('Data fetched successfully:', response.data); // Log successful data fetch
        } catch (err) {
            console.error('Error fetching data:', err.response ? err.response.data.message : 'Failed to fetch data. Please try again.', err);
            console.error('Error stack:', err.stack); // Log the entire error stack
            setError(err.response ? err.response.data.message : 'Failed to fetch data. Please try again.');
        } finally {
            setLoading(false); // Reset loading state after request is done
        }
    };

    return (
        <div>
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
=======
import React, { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '../context/QueryContext'; // Import the useQuery hook
import ProgressIndicator from './ProgressIndicator'; // Import the ProgressIndicator component

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
      const response = await axios.post('/api/data/query', { query }, { withCredentials: true });
      setResults(response.data); // Use the context to set results
      console.log('Data fetched successfully:', response.data);
    } catch (err) {
      console.error('Error fetching data:', err.response ? err.response.data.message : 'Failed to fetch data. Please try again.', err);
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
>>>>>>> 551e70b (refactoring)
}

export default EconomyDataQueryForm;