// File: nextjs-app/pages/_app.js
import React, { useEffect } from 'react'
import '../styles/globals.css'
import Layout from '../components/Layout'
import { QueryProvider } from '../context/QueryContext'
import PropTypes from 'prop-types'

function MyApp ({ Component, pageProps }) {
  useEffect(() => {
    console.log('Application has mounted.')
  }, [])

  return (
    <QueryProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired
}

export default MyApp

