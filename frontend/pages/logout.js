import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { destroyCookie } from 'nookies';
import { API_ENDPOINTS } from '../utils/apiConfig';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post(API_ENDPOINTS.logout, {}, { withCredentials: true });
        console.log('Logout successful');
        destroyCookie(null, 'jwt');
        localStorage.removeItem('isAuthenticated');
        router.push('/');
      } catch (err) {
        console.error('Logout failed:', err.response ? err.response.data.message : err.message);
        console.error('Error stack:', err.stack);
      }
    };

    logout();
  }, [router]);

  return <div style={{ textAlign: 'center', marginTop: '20%' }}>Redirecting...</div>;
};

export default Logout;