import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';




const ResetPassword = ({handleOnchange,handleOnSubmit, formSwitcher, email }) => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="p-4 shadow rounded bg-white">
            <h1 className="text-center">Reset Password</h1>
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
              


              <Button type="submit" className="w-100 mt-3">Reset Password</Button>
            </Form>
            <hr />
            <div className="text-center">
            <a href="#!" onClick={() => formSwitcher('login')}>Login Now</a>

            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
ResetPassword.propTypes = {
    handleOnchange: PropTypes.func.isRequired,
    handleOnSubmit: PropTypes.func.isRequired,
    formSwitcher: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired
    
}