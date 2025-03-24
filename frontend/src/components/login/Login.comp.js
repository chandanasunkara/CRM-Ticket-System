import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';




const LoginForm = ({handleOnchange, email, password }) => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="p-4 shadow rounded bg-white">
            <h1 className="text-center">Client Login</h1>
            <hr />
            <Form>
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
              <a href="#!">Forget Password?</a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
