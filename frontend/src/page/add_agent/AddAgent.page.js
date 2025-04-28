import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Table } from 'react-bootstrap';
import { PageBreadcrumb } from '../../components/breadcrumb/Breadcrumb.comp';
import api from '../../config/api';

const AddAgent = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [assignedAgents, setAssignedAgents] = useState([]);

  useEffect(() => {
    fetchAssignedAgents();
  }, []);

  const fetchAssignedAgents = async () => {
    try {
      const response = await api.get('/api/users/agents');
      setAssignedAgents(response.data.data);
    } catch (error) {
      console.error('Error fetching assigned agents:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Get the current user's ID (client)
      const userResponse = await api.get('/api/users/me');
      const clientId = userResponse.data._id;

      // Assign the agent to the client
      await api.post('/api/users/assign-agent', {
        agentEmail: email,
        clientId: clientId
      });

      setSuccess('Agent assigned successfully');
      setEmail('');
      fetchAssignedAgents(); // Refresh the list
    } catch (error) {
      console.error('Error assigning agent:', error);
      setError(error.response?.data?.message || 'Error assigning agent. Please make sure the email is correct and the user exists.');
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
                required
                placeholder="Enter agent's email address"
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Assign Agent
            </Button>
          </Form>
        </Col>
      </Row>

      {assignedAgents.length > 0 && (
        <Row className="mt-4">
          <Col>
            <h4>Your Assigned Agents</h4>
            <Table striped hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {assignedAgents.map(agent => (
                  <tr key={agent._id}>
                    <td>{agent.name}</td>
                    <td>{agent.email}</td>
                    <td>Active</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AddAgent; 