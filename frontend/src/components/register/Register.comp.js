import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';


const RegisterForm = ({handleOnchange,handleOnRegisterSubmit, formSwitcher, name, email, password, confirmPassword }) => {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <div className="login-card">
              <h1 className="text-center">Register</h1>
              <hr />
              <Form autoComplete='off' onSubmit={handleOnRegisterSubmit}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={name}
                    onChange = {handleOnchange}
                    placeholder="Enter Name"
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange = {handleOnchange}
                    placeholder="Enter Email"
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={password}
                    onChange = {handleOnchange}
                    placeholder="Password"
                    required
                    
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange = {handleOnchange}
                    placeholder="Confirm Password"
                    required
                    
                  />
                </Form.Group>
                <Button type="submit" className="w-100 mt-3">Register</Button>
              </Form>
              <hr />
              <div className="text-center">
                <a href="#!" onClick={() => formSwitcher('login')}>Back to Login</a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  };
   
  export default RegisterForm;
   
  RegisterForm.propTypes = {
      handleOnchange: PropTypes.func.isRequired,
      handleOnRegisterSubmit: PropTypes.func.isRequired,
      formSwitcher: PropTypes.func.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
      confirmPassword: PropTypes.string.isRequired
  }