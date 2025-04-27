import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { PageBreadcrumb } from '../../components/breadcrumb/Breadcrumb.comp';
import api from '../../config/api';

const AddAgent = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await api.post('/api/users/agents', {
        email: email,
        role: 'agent'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Agent invitation sent successfully');
      setEmail('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error sending agent invitation');
    }
  };

  return (
    <Container>
      <Row className="mt-3">
        <Col>
          <PageBreadcrumb page="Add Agent" />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6} className="mx-auto">
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>Agent Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter agent's email address"
                required
              />
              <Form.Text className="text-muted">
                An invitation will be sent to this email address
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
              Send Invitation
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddAgent; 