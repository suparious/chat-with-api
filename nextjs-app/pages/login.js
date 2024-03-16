import { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', { username, password });
            console.log('Login successful:', res.data.message);
            // Redirect to home page on successful login
            Router.push('/');
        } catch (err) {
            console.error('Login failed:', err.response ? err.response.data.message : err.message);
            console.error('Error stack:', err.stack); // Log the entire error stack
            setError(err.response ? err.response.data.message : 'Login failed. Please check your credentials.');
        }
    };

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