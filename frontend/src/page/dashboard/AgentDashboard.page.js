import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import { PageBreadcrumb } from '../../components/breadcrumb/Breadcrumb.comp';
import api from '../../config/api';
import { TicketTable } from '../../components/ticket-table/TicketTable.comp';
import { PieChart } from '../../components/pie-chart/PieChart.comp';

const AgentDashboard = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientTickets, setClientTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    open: 0,
    closed: 0
  });

  useEffect(() => {
    fetchClients();
    fetchStats();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchClientTickets(selectedClient._id);
    }
  }, [selectedClient]);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/users/clients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientTickets = async (clientId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/tickets/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClientTickets(response.data.data);
    } catch (error) {
      console.error('Error fetching client tickets:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/tickets/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleResolveTicket = async (ticketId) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/tickets/${ticketId}/resolve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (selectedClient) {
        fetchClientTickets(selectedClient._id);
      }
      fetchStats();
    } catch (error) {
      console.error('Error resolving ticket:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row className="mt-3">
        <Col>
          <PageBreadcrumb page="Agent Dashboard" />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={4}>
          <Card>
            <Card.Header>
              <h4>Ticket Statistics</h4>
            </Card.Header>
            <Card.Body>
              <PieChart stats={stats} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h4>Assigned Clients</h4>
            </Card.Header>
            <Card.Body>
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Active Tickets</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    <tr 
                      key={client._id}
                      onClick={() => setSelectedClient(client)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{client.name}</td>
                      <td>{client.email}</td>
                      <td>
                        <Badge bg="primary">{client.activeTickets || 0}</Badge>
                      </td>
                      <td>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClient(client);
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
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h4>Tickets for {selectedClient.name}</h4>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setSelectedClient(null)}
                >
                  Back to Clients
                </Button>
              </Card.Header>
              <Card.Body>
                <TicketTable 
                  tickets={clientTickets}
                  onResolve={handleResolveTicket}
                  showResolveButton={true}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AgentDashboard; 