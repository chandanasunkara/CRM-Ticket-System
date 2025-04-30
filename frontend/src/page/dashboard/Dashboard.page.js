import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button, Pagination } from "react-bootstrap";
import { TicketTable } from "../../components/ticket-table/TicketTable.comp";
import Chart from 'chart.js/auto';
import { PageBreadcrumb } from "../../components/breadcrumb/Breadcrumb.comp";
import { Link } from "react-router-dom";
import api from "../../config/api";
import AgentDashboard from "./AgentDashboard.page";

const Dashboard = () => {
  // Initialize all hooks at the top level
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartInstanceRef1 = useRef(null);
  const chartInstanceRef2 = useRef(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'customer';

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await api.get('/api/tickets', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Log the response to see its structure
      console.log('API Response:', response);

      // Handle different possible response structures
      let ticketsData = [];
      if (Array.isArray(response.data)) {
        ticketsData = response.data;
      } else if (response.data && Array.isArray(response.data.tickets)) {
        ticketsData = response.data.tickets;
      } else if (response.data && response.data.data) {
        ticketsData = Array.isArray(response.data.data) ? response.data.data : [];
      }

      console.log('Processed tickets:', ticketsData);
      setTickets(ticketsData);
      
      // Update chart data based on real tickets
      const completedTickets = ticketsData.filter(ticket => ticket.status === 'closed').length;
      const pendingTickets = ticketsData.filter(ticket => ticket.status !== 'closed').length;
      const totalTickets = completedTickets + pendingTickets;

      const activeTickets = ticketsData.filter(ticket => ticket.status === 'open').length;
      const inactiveTickets = ticketsData.filter(ticket => ticket.status !== 'open').length;
      const totalStatusTickets = activeTickets + inactiveTickets;

      // Update charts
      if (chartInstanceRef1.current) chartInstanceRef1.current.destroy();
      if (chartInstanceRef2.current) chartInstanceRef2.current.destroy();

      const ctx1 = chartRef1.current.getContext('2d');
      const ctx2 = chartRef2.current.getContext('2d');

      chartInstanceRef1.current = new Chart(ctx1, {
        type: 'pie',
        data: {
          labels: ['Completed', 'Pending'],
          datasets: [{
            data: [completedTickets, pendingTickets],
            backgroundColor: ['#4CAF50', '#FF9800']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Ticket Status' }
          }
        }
      });

      chartInstanceRef2.current = new Chart(ctx2, {
        type: 'pie',
        data: {
          labels: ['Active', 'Inactive'],
          datasets: [{
            data: [activeTickets, inactiveTickets],
            backgroundColor: ['#2196F3', '#9E9E9E']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Activity Status' }
          }
        }
      });
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Move useEffect to the top level
  useEffect(() => {
    fetchTickets();
  }, [refreshKey]);

  // If user is an agent, render the AgentDashboard
  if (userRole === 'agent') {
    return <AgentDashboard />;
  }

  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey(prev => prev + 1);
  };

  // Calculate pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Container>
      <Row className="breadcrumbs mt-3">
        <Col>
          <PageBreadcrumb page="Dashboard" />
        </Col>
        <Col className="text-end">
          <Button 
            variant="outline-primary" 
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Tickets'}
          </Button>
        </Col>
      </Row>

      <Row className="charts-row mt-4 text-center">
        <Col md={6}>
          <div>Total Tickets: {tickets.length}</div>
          <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
            <canvas ref={chartRef1}></canvas>
          </div>
        </Col>

        <Col md={6}>
          <div>Total Status: {tickets.length}</div>
          <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
            <canvas ref={chartRef2}></canvas>
          </div>
        </Col>
      </Row>

      <Row className="buttons text-center my-4">
        <Col>
          <Link to="/add-ticket">
            <Button
              variant="success"
              style={{ fontSize: "1.5rem", padding: "10px 30px" }}
            >
              Add New Ticket
            </Button>
          </Link>
        </Col>
      </Row>

      <Row>
        <Col className="mt-2" style={{ fontSize: '1.2rem', fontWeight: '500' }}>
          Recently Added tickets
        </Col>
      </Row>
      <hr />
      <Row>
        <Col className="recent-ticket" style={{ fontSize: '1.1rem' }}>
          {loading ? (
            <div className="text-center">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="text-center">No tickets found</div>
          ) : (
            <>
              <TicketTable tickets={currentTickets} />
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.Prev 
                      onClick={() => paginate(currentPage - 1)} 
                      disabled={currentPage === 1}
                    />
                    {pageNumbers.map(number => (
                      <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next 
                      onClick={() => paginate(currentPage + 1)} 
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;