import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';




const LoginForm = ({handleOnchange,handleOnSubmit, formSwitcher, email, password }) => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="login-card">
            <h1 className="text-center">Client Login</h1>
            <hr />
            <Form autoComplete='off' onSubmit={handleOnSubmit}>
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
              <Button type="submit" className="w-100 mt-3">Login</Button>
            </Form>
            <hr />
            <div className="text-center">
              <a href="#!" onClick={() => formSwitcher('reset')}>Forget Password?</a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
LoginForm.propTypes = {
    handleOnchange: PropTypes.func.isRequired,
    handleOnSubmit: PropTypes.func.isRequired,
    formSwitcher: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
}