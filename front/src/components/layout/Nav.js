import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from 'react-bootstrap';
import '../../styles/components/layout/Nav.css';

const Navigation = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="md">
            <Container>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mi-navbar mx-auto ext-center">
                        <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
                        <Nav.Link as={NavLink} to="/novedades">Novedades</Nav.Link>
                        <Nav.Link as={NavLink} to="/galeria">Galeria</Nav.Link>
                        <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;