import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import api from '../config/api';

const AgentInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/users/invitations');
      setInvitations(response.data.data || []);
    } catch (err) {
      console.error('Error fetching invitations:', err);
      setError('Failed to fetch invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleInvitation = async (invitationId, action) => {
    try {
      setError(null);
      setSuccess(null);
      await api.post('/api/users/invitations/handle', {
        invitationId,
        action
      });
      setSuccess(`Invitation ${action}ed successfully`);
      fetchInvitations();
    } catch (err) {
      console.error('Error handling invitation:', err);
      setError(`Failed to ${action} invitation`);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <h2>My Invitations</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      {invitations.length === 0 ? (
        <Alert variant="info">You have no pending invitations.</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Client</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((invitation) => (
              <tr key={invitation._id}>
                <td>{invitation.client.name}</td>
                <td>
                  <Badge bg={
                    invitation.status === 'pending' ? 'warning' :
                    invitation.status === 'accepted' ? 'success' : 'danger'
                  }>
                    {invitation.status}
                  </Badge>
                </td>
                <td>{new Date(invitation.createdAt).toLocaleDateString()}</td>
                <td>
                  {invitation.status === 'pending' && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleInvitation(invitation._id, 'accept')}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleInvitation(invitation._id, 'reject')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AgentInvitations; 