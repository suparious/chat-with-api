import React, { useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';

export default function Logout() {
  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post('/api/auth/logout', {}, { withCredentials: true });
        console.log('Logout successful');
        localStorage.removeItem('isAuthenticated');
        Router.push('/');
      } catch (err) {
        console.error('Logout failed:', err.response ? err.response.data.message : err.message);
        console.error('Error stack:', err.stack);
      }
    };

    logout();
  }, []);

  return <div>Logging out...</div>;
}