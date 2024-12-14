import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom"; // Use NavLink for navigation

export const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
      <Container>
        <Navbar.Brand>
          <p className="logo">Waspada Begal Pekanbaru</p>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Use NavLink for React Router navigation */}
            <Nav.Link as={NavLink} to="/" className="navbar-link">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/skills" className="navbar-link">
              Tentang
            </Nav.Link>
            <Nav.Link as={NavLink} to="/map" className="navbar-link">
              Maps
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
