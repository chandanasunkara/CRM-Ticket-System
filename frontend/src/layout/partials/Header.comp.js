import React from 'react';
import {Navbar,Nav} from 'react-bootstrap'
import logo from '../../assets/img/logo.png'
import { Link } from 'react-router-dom';

const Header = () => {
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'customer';

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
          <div className="nav-link text-light">
            Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </div>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          {userRole === 'customer' && (
            <Link to="/add-agent" className="nav-link">Add Agent</Link>
          )}
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/" className="nav-link">Logout</Link>
        </Nav>
    </Navbar.Collapse>
  </Navbar>;
};

export default Header;