import axios from 'axios';
import Layout from '../components/Layout';

export async function getStaticProps() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'; // Use environment variable
  try {
    const res = await axios.get(`${backendUrl}/api/welcome-info`);
    return {
      props: {
        welcomeInfo: res.data,
      },
    };
  } catch (error) {
    console.error('Failed to fetch welcome info:', error.message);
    console.error('Error stack:', error.stack);
    return {
      props: {
        welcomeInfo: {},
      },
    };
  }
}

export default function Home({ welcomeInfo }) {
  return (
    <Layout>
      <div>
        <h1>Welcome to Chat_with_USA_Economy_Data</h1>
        {/* Maintain a simple welcome message for users preferring a brief introduction */}
        <p>Welcome to the Next.js app for Chat_with_USA_Economy_Data!</p>
        {/* Provide more detailed information for users interested in learning more */}
        {welcomeInfo.message && <p>{welcomeInfo.message}</p>}
        {welcomeInfo.appDescription && <p>{welcomeInfo.appDescription}</p>}
      </div>
    </Layout>
  );
}