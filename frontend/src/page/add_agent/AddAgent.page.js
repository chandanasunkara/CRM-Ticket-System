import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Table, Badge } from 'react-bootstrap';
import { PageBreadcrumb } from '../../components/breadcrumb/Breadcrumb.comp';
import api from '../../config/api';

const AddAgent = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [assignedAgents, setAssignedAgents] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);

  useEffect(() => {
    fetchAssignedAgents();
    fetchPendingInvitations();
  }, []);

  const fetchAssignedAgents = async () => {
    try {
      const response = await api.get('/api/users/agents');
      setAssignedAgents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching assigned agents:', error);
    }
  };

  const fetchPendingInvitations = async () => {
    try {
      const response = await api.get('/api/users/pending-invitations');
      setPendingInvitations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching pending invitations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/api/users/assign-agent', {
        agentEmail: email
      });

      if (response.data.success) {
        setSuccess('Invitation sent successfully');
        setEmail('');
        fetchPendingInvitations(); // Refresh the list
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      setError(error.response?.data?.message || 'Error sending invitation. Please make sure the email is correct and the user exists.');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'pending': 'warning',
      'accepted': 'success',
      'rejected': 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
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
              Send Invitation
            </Button>
          </Form>
        </Col>
      </Row>

      {(assignedAgents.length > 0 || pendingInvitations.length > 0) && (
        <Row className="mt-4">
          <Col>
            <h4>Your Agents</h4>
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
                    <td>{getStatusBadge('accepted')}</td>
                  </tr>
                ))}
                {pendingInvitations.map(invitation => (
                  <tr key={invitation._id}>
                    <td>{invitation.agent.name}</td>
                    <td>{invitation.agent.email}</td>
                    <td>{getStatusBadge(invitation.status)}</td>
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