import React from 'react';
import Head from 'next/head'
import Link from 'next/link'
import PropTypes from 'prop-types'; // Import PropTypes
import { Container, Navbar, Nav } from 'react-bootstrap'
import styles from '../styles/navbar.module.css' // Importing custom navbar styles

const Layout = ({ children, title = 'Chat_with_USA_Economy_Data' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Navbar bg="dark" variant="dark" expand="lg" className={styles.navbar}>
        <Container>
          <Link href="/" passHref><Navbar.Brand className={styles.navbarBrand}>Chat_with_USA_Economy_Data</Navbar.Brand></Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref><Nav.Link className={styles.navLink}>Home</Nav.Link></Link>
              <Link href="/query#" passHref><Nav.Link className={styles.navLink}>Query</Nav.Link></Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container style={{ marginTop: '20px' }}>
        {children}
      </Container>
      <footer className="footer mt-auto py-3 bg-light">
        <Container className="text-center">
          <span className="text-muted">Copyright &copy; {new Date().getFullYear()} Chat_with_USA_Economy_Data</span>
        </Container>
      </footer>
    </>
  );
};

// Define PropTypes for Layout component
Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
};

export default Layout;