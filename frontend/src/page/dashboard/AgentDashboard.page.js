import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Tabs, Tab, Alert, Spinner, Pagination } from 'react-bootstrap';
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(10);
  const [allOpenTickets, setAllOpenTickets] = useState([]);

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
        await Promise.all([fetchStats(), fetchClients(), fetchAllOpenTickets()]);
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
    // Set up interval for automatic updates
    const interval = setInterval(() => {
      fetchStats();
      fetchAllOpenTickets();
      if (selectedClient) {
        fetchClientTickets(selectedClient._id);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [navigate, selectedClient]);

  const fetchAllOpenTickets = async () => {
    try {
      const response = await api.get('/api/tickets?status=open');
      const sortedTickets = response.data.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setAllOpenTickets(sortedTickets || []);
    } catch (error) {
      console.error('Error fetching open tickets:', error);
      if (error.response?.status === 401) {
        throw error;
      }
      setError('Failed to load open tickets');
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get('/api/users/clients');
      setClients(response.data.data || []);
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
      // Sort tickets: open first, then closed
      const sortedTickets = response.data.data.sort((a, b) => {
        if (a.status === 'open' && b.status !== 'open') return -1;
        if (a.status !== 'open' && b.status === 'open') return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setClientTickets(sortedTickets || []);
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
      }
      fetchAllOpenTickets();
      fetchStats();
    } catch (error) {
      console.error('Error resolving ticket:', error);
      if (error.response?.status === 401) {
        throw error;
      }
      setError('Failed to resolve ticket');
    }
  };

  const handleViewTickets = (client) => {
    setSelectedClient(client);
    fetchClientTickets(client._id);
    setActiveTab('tickets');
  };

  // Get current tickets for pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = allOpenTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(allOpenTickets.length / ticketsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
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
                  <h4>Open Tickets</h4>
                </Card.Header>
                <Card.Body>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Client</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTickets.map((ticket) => (
                        <tr key={ticket._id}>
                          <td>{ticket.subject}</td>
                          <td>{ticket.customer?.name || 'Unknown'}</td>
                          <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                          <td>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => navigate(`/ticket/${ticket._id}`)}
                            >
                              View
                            </Button>
                            <Button
                              variant="success"
                              size="sm"
                              className="ms-2"
                              onClick={() => handleResolveTicket(ticket._id)}
                            >
                              Resolve
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-3">
                      <Pagination>
                        <Pagination.First onClick={() => paginate(1)} />
                        <Pagination.Prev 
                          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} 
                        />
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                          <Pagination.Item
                            key={number}
                            active={number === currentPage}
                            onClick={() => paginate(number)}
                          >
                            {number}
                          </Pagination.Item>
                        ))}
                        <Pagination.Next 
                          onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)} 
                        />
                        <Pagination.Last onClick={() => paginate(totalPages)} />
                      </Pagination>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="tickets" title="Tickets">
          {selectedClient ? (
            <Row className="mt-4">
              <Col md={12}>
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h4>{selectedClient.name}'s Tickets</h4>
                    <Button variant="secondary" size="sm" onClick={() => {
                      setSelectedClient(null);
                      setActiveTab('clients');
                    }}>
                      Back to Clients
                    </Button>
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
          ) : (
            <Row className="mt-4">
              <Col md={12}>
                <Card>
                  <Card.Header>
                    <h4>Select a Client to View Their Tickets</h4>
                  </Card.Header>
                  <Card.Body>
                    <p>Please go to the Clients tab and select a client to view their tickets.</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Tab>
        <Tab eventKey="clients" title="Clients">
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
                              onClick={() => handleViewTickets(client)}
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
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AgentDashboard; 