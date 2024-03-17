import { useState, useEffect } from 'react'
import axios from 'axios'
import Router from 'next/router'
import { setCookie } from 'nookies'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
      const res = await axios.post('/api/auth/login', { username, password }, { withCredentials: true })
      console.log('Login successful:', res.data.message)

      // Store the JWT token in a cookie
      setCookie(null, 'jwt', res.data.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
      console.log('JWT token stored in cookie')

      // Update local storage to reflect authentication state
      localStorage.setItem('isAuthenticated', 'true')
      console.log('Authentication state updated in local storage')

      // Redirect to query page on successful login
      Router.push('/query')
    } catch (err) {
      console.error('Login failed:', err.response ? err.response.data.message : err.message)
      console.error('Error stack:', err.stack) // Log the entire error stack
      setError(err.response ? err.response.data.message : 'Login failed. Please check your credentials.')
    }
  }

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}