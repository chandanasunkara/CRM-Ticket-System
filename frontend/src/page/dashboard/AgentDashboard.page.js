import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Tabs, Tab, Alert, Spinner } from 'react-bootstrap';
import { PageBreadcrumb } from '../../components/breadcrumb/Breadcrumb.comp';
import api from '../../config/api';
import { PieChart } from '../../components/pie-chart/PieChart.comp';
import { useNavigate } from 'react-router-dom';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientTickets, setClientTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    open: 0,
    closed: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([fetchStats()]);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
        } else {
          setError('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const fetchClients = async () => {
    try {
      const response = await api.get('/api/users/clients');
      setClients(response.data.data || []);
      
      // If there are clients, select the first one by default
      if (response.data.data && response.data.data.length > 0) {
        setSelectedClient(response.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      if (error.response?.status === 401) {
        throw error;
      }
      setError('Failed to fetch clients');
    }
  };

  const fetchClientTickets = async (clientId) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/tickets?customer=${clientId}`);
      setClientTickets(response.data.data || []);
    } catch (error) {
      console.error('Error fetching client tickets:', error);
      if (error.response?.status === 401) {
        throw error;
      }
      setError('Failed to load client tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/tickets');
      const stats = response.data.stats || {
        total: 0,
        pending: 0,
        open: 0,
        closed: 0
      };
      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (error.response?.status === 401) {
        throw error;
      }
      setError('Failed to load ticket statistics');
    }
  };

  const handleResolveTicket = async (ticketId) => {
    try {
      await api.put(`/api/tickets/${ticketId}`, { status: 'closed' });
      if (selectedClient) {
        fetchClientTickets(selectedClient._id);
        fetchStats();
      }
    } catch (error) {
      console.error('Error resolving ticket:', error);
      if (error.response?.status === 401) {
        throw error;
      }
      setError('Failed to resolve ticket');
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
      <Row className="mt-3">
        <Col>
          <PageBreadcrumb page="Agent Dashboard" />
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      <Tabs defaultActiveKey="dashboard" className="mb-3">
        <Tab eventKey="dashboard" title="Dashboard">
          <Row className="mt-4">
            <Col md={12}>
              <Card>
                <Card.Header>
                  <h4>Ticket Statistics</h4>
                </Card.Header>
                <Card.Body>
                  <PieChart data={stats} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={12}>
              <Card>
                <Card.Header>
                  <h4>Recent Activity</h4>
                </Card.Header>
                <Card.Body>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Status</th>
                        <th>Last Updated</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientTickets.slice(0, 5).map((ticket) => (
                        <tr key={ticket._id}>
                          <td>{ticket._id}</td>
                          <td>
                            <Badge bg={ticket.status === 'open' ? 'danger' : ticket.status === 'in-progress' ? 'warning' : 'success'}>
                              {ticket.status}
                            </Badge>
                          </td>
                          <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                          <td>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => navigate(`/ticket/${ticket._id}`)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="clients" title="Clients" onEnter={fetchClients}>
          <Row className="mt-4">
            <Col md={12}>
              <Card>
                <Card.Header>
                  <h4>My Clients</h4>
                </Card.Header>
                <Card.Body>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Active Tickets</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client) => (
                        <tr key={client._id}>
                          <td>{client.name}</td>
                          <td>{client.email}</td>
                          <td>
                            <Badge bg="primary">
                              {clientTickets.filter(t => t.status === 'open').length}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setSelectedClient(client);
                                fetchClientTickets(client._id);
                              }}
                            >
                              View Tickets
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {selectedClient && (
            <Row className="mt-4">
              <Col md={12}>
                <Card>
                  <Card.Header>
                    <h4>{selectedClient.name}'s Tickets</h4>
                  </Card.Header>
                  <Card.Body>
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Status</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientTickets.map((ticket) => (
                          <tr key={ticket._id}>
                            <td>{ticket.subject}</td>
                            <td>
                              <Badge bg={ticket.status === 'open' ? 'danger' : ticket.status === 'in-progress' ? 'warning' : 'success'}>
                                {ticket.status}
                              </Badge>
                            </td>
                            <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                            <td>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => navigate(`/ticket/${ticket._id}`)}
                              >
                                View
                              </Button>
                              {ticket.status !== 'closed' && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  className="ms-2"
                                  onClick={() => handleResolveTicket(ticket._id)}
                                >
                                  Resolve
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AgentDashboard; 