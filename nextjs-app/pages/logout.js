import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Logout = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post('/api/auth/logout', {}, { withCredentials: true });
        localStorage.removeItem('isAuthenticated');
        router.push('/');
      } catch (error) {
        console.error('Error during logout:', error.message, error.stack);
        // Redirect or show an error message based on your application's requirement
        router.push('/login'); // Assuming you have a login page to redirect to in case of failure
      } finally {
        setLoading(false);
      }
    };
    logout();
  }, [router]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '20%' }}>Logging out...</div>;
  }

  // Normally, you wouldn't reach this return as the user would be redirected,
  // but it's here as a fallback
  return <div style={{ textAlign: 'center', marginTop: '20%' }}>Redirecting...</div>;
};

export default Logout;