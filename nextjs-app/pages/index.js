import axios from 'axios'
import Layout from '../components/Layout'
import PropTypes from 'prop-types'

export async function getStaticProps () {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000' // Use environment variable
  try {
    const res = await axios.get(`${backendUrl}/api/welcome-info`)
    return {
      props: {
        welcomeInfo: res.data
      }
    }
  } catch (error) {
    console.error('Failed to fetch welcome info:', error.message)
    console.error('Error stack:', error.stack)
    // Providing a default value for welcomeInfo in case of error
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
          appDescription: 'This application allows users to query various public APIs for datasets related to the United States economy. Due to an error, more detailed information cannot be provided at this moment.'
        }
        e.propTypes = {
  welcomeInfo: PropTypes.shape({
    message: PropTypes.string,
    appDescription: PropTypes.string
  }).isRequired
}

export default function Home ({ welcomeInfo }) {
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
)
