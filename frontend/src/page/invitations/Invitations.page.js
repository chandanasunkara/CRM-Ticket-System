import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Alert } from 'react-bootstrap';
import { PageBreadcrumb } from '../../components/breadcrumb/Breadcrumb.comp';
import api from '../../config/api';

const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/users/invitations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvitations(response.data.data);
    } catch (error) {
      setError('Error fetching invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId) => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/api/users/invitations/${invitationId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Invitation accepted successfully');
      fetchInvitations();
    } catch (error) {
      setError('Error accepting invitation');
    }
  };

  const handleDeclineInvitation = async (invitationId) => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/api/users/invitations/${invitationId}/decline`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Invitation declined');
      fetchInvitations();
    } catch (error) {
      setError('Error declining invitation');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row className="mt-3">
        <Col>
          <PageBreadcrumb page="Invitations" />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h4>Pending Invitations</h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              {invitations.length === 0 ? (
                <p>No pending invitations</p>
              ) : (
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>Email</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitations.map(invitation => (
                      <tr key={invitation._id}>
                        <td>{invitation.from.name}</td>
                        <td>{invitation.from.email}</td>
                        <td>{new Date(invitation.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() => handleAcceptInvitation(invitation._id)}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeclineInvitation(invitation._id)}
                          >
                            Decline
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Invitations; 