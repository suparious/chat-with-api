import { useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'

export default function QueryInterface () {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await axios.post('/api/query', { query })
      setResult(response.data)
      console.log('Query submitted successfully:', query)
    } catch (err) {
      console.error('Failed to process the query:', err)
      setError('Failed to process the query. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <h2>Ask about the US Economy</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="queryInput" className="form-label">Your Query</label>
          <input
            type="text"
            className="form-control"
            id="queryInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query here, e.g., 'What is the current unemployment rate?' or 'Show GDP growth last quarter'"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>
      {result && (
        <div className="mt-4">
          <h4>Query Result:</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div className="alert alert-danger mt-4" role="alert">
          {error}
        </div>
      )}
    </Layout>
  );
}
