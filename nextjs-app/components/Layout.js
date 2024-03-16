import Head from 'next/head';
import Link from 'next/link';
import { Container, Navbar, Nav } from 'react-bootstrap';

export default function Layout({ children, title = 'Chat_with_USA_Economy_Data' }) {
  console.log(`Rendering Layout for: ${title}`);
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-CTV9l9nT+E+Y4p1PjsrF5ZDv3ylZdCJ0zYzwR+l5gLF5jEw3RHZ5lA6wbe4Q6gG8" crossorigin="anonymous" />
      </Head>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Chat_with_USA_Economy_Data</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref><Nav.Link>Home</Nav.Link></Link>
              <Link href="/query-interface" passHref><Nav.Link>Query Interface</Nav.Link></Link>
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