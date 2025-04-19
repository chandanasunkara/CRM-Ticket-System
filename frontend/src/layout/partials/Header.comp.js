import React from 'react';
import {Navbar,Nav} from 'react-bootstrap'
import logo from '../../assets/img/logo.png'
import { Link } from 'react-router-dom';

const Header = () => {
  return <Navbar
  collapseOnSelect
  bg="success"
  variant="dark"
  expand="md"
  >
    <Navbar.Brand>
        <img src={logo} alt="logo" width="50px"/>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls='basic-navbar-nav' />
    <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className="ms-auto">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/ticket/1" className="nav-link">Tickets</Link>
<Link to="/add-ticket" className="nav-link">Add New Client</Link>
<Link to="/logout" className="nav-link">Logout</Link>

        </Nav>
    </Navbar.Collapse>
  </Navbar>;
};

export default Header;
