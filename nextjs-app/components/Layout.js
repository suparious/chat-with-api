import Head from 'next/head';
import Link from 'next/link';
import { Container, Navbar, Nav } from 'react-bootstrap';

export default function Layout({ children, title = 'Chat_with_USA_Economy_Data' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Link href="/" passHref><Navbar.Brand>Chat_with_USA_Economy_Data</Navbar.Brand></Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref><Nav.Link>Home</Nav.Link></Link>
              <Link href="/query" passHref><Nav.Link>Query</Nav.Link></Link>
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
}