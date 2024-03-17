import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import PropTypes from 'prop-types'

export async function getStaticProps() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const res = await axios.get(`${backendUrl}/v1/data`);
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
        welcomeInfo: {
          message: 'Welcome to Chat_with_USA_Economy_Data! This is default message due to an error fetching dynamic content.',
          appDescription: 'This application allows users to query various public APIs for datasets related to the United States economy. Due to an error, more detailed information cannot be provided at this moment.',
        },
      },
    };
  }
}

export default function Home({ welcomeInfo }) {
  const [dynamicWelcomeInfo, setDynamicWelcomeInfo] = useState(welcomeInfo);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    axios.get(`${backendUrl}/v1/data`)
      .then(res => setDynamicWelcomeInfo(res.data))
      .catch(error => console.error('Failed to fetch welcome info dynamically:', error.message));
  }, []);

  return (
    <Layout>
      <div>
        <h1>Welcome to Chat_with_USA_Economy_Data</h1>
        <p>Welcome to the Next.js app for Chat_with_USA_Economy_Data!</p>
        {dynamicWelcomeInfo.message && <p>{dynamicWelcomeInfo.message}</p>}
        {dynamicWelcomeInfo.appDescription && <p>{dynamicWelcomeInfo.appDescription}</p>}
      </div>
    </Layout>
  );
}

Home.propTypes = {
  welcomeInfo: PropTypes.shape({
    message: PropTypes.string.isRequired,
    appDescription: PropTypes.string.isRequired,
  }).isRequired,
}