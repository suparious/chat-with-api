import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('isAuthenticated');
    console.log('User logged out. JWT token removed from localStorage.');
    router.push('/').catch((error) => {
      console.error('Error redirecting after logout:', error.message, error.stack);
    });
  }, [router]);

  // As the logout process is instantaneous from the client side, this page will always redirect.
  return <div style={{ textAlign: 'center', marginTop: '20%' }}>Redirecting...</div>;
};

export default Logout;