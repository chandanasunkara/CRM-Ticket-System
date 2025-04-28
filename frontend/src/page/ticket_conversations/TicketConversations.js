import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import api from "../../config/api";

const TicketConversations = () => {
  const { tId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view ticket details');
          return;
        }

        const response = await api.get(`/api/tickets/${tId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data && response.data.data) {
          setTicket(response.data.data);
        } else {
          setError('Invalid ticket data received');
        }
      } catch (error) {
        console.error('Error fetching ticket:', error);
        setError('Failed to load ticket details');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [tId]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to submit a reply');
        return;
      }

      const response = await api.post(`/api/tickets/${tId}/comments`, 
        { text: replyText },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.data) {
        setTicket(response.data.data);
      setReplyText(""); 
    }
    } catch (error) {
      console.error('Error submitting reply:', error);
      setError('Failed to submit reply');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div>Loading ticket details...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!ticket) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="warning">Ticket not found</Alert>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mt-3">
        <Col>
          <h2>Ticket Details</h2>
          <hr />
        </Col>
      </Row>

      <Row>
        <Col>
          <h4>Subject: {ticket.subject}</h4>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Priority:</strong> {ticket.priority}</p>
          <p><strong>Category:</strong> {ticket.category}</p>
          <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h4>Description</h4>
          <p>{ticket.description}</p>
        </Col>
      </Row>

      {ticket.comments && ticket.comments.length > 0 && (
        <Row className="mt-4">
          <Col>
            <h4>Conversation History</h4>
            {ticket.comments.map((comment, index) => (
              <div key={index} className="mb-3 p-3 border rounded">
                <p><strong>{comment.user?.name || 'Unknown User'}:</strong> {comment.text}</p>
                <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
            </div>
          ))}
          </Col>
        </Row>
      )}

      <Row className="mt-4">
        <Col>
          <h4>Add Reply</h4>
          <Form onSubmit={handleReplySubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your reply here..."
        />
            </Form.Group>
            <Button variant="success" type="submit">
          Submit Reply
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default TicketConversations;
