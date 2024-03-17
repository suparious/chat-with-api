import { useState, useEffect } from 'react'
import axios from 'axios'
import Router from 'next/router'
import { API_ENDPOINTS } from '../utils/apiConfig'

export default function Register () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    if (isAuthenticated) {
      console.log('User already authenticated, redirecting to query page')
      Router.push('/query')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(API_ENDPOINTS.register, { username, password, email })
      console.log('Registration successful:', res.data.message)
      // Redirect to home page on successful registration
      Router.push('/')
    } catch (err) {
      console.error('Registration failed:', err.response ? err.response.data.message : err.message)
      console.error('Error stack:', err.stack) // Log the entire error stack
      setError(err.response ? err.response.data.message : 'Registration failed. Please check your credentials.')
    }
  }

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}