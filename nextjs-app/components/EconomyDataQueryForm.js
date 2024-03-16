import { useState } from 'react';
import axios from 'axios';

function EconomyDataQueryForm() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setResults(null);
        try {
            const response = await axios.post('/api/data/query', { query });
            setResults(response.data);
        } catch (err) {
            console.error('Error fetching data:', err.response ? err.response.data.message : 'Failed to fetch data. Please try again.', err);
            setError(err.response ? err.response.data.message : 'Failed to fetch data. Please try again.');
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
                <button type="submit">Submit</button>
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