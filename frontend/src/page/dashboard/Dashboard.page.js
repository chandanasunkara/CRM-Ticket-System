import React, { useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { TicketTable } from "../../components/ticket-table/TicketTable.comp";
import tickets from '../../assets/data/dummy-tickets.json';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartInstanceRef1 = useRef(null);
  const chartInstanceRef2 = useRef(null);

  const completedTickets = 45;
  const pendingTickets = 5;
  const totalTickets = completedTickets + pendingTickets;

  const activeTickets = 40;
  const inactiveTickets = 10;
  const totalStatusTickets = activeTickets + inactiveTickets;

  useEffect(() => {
    const ctx1 = chartRef1.current.getContext('2d');
    const ctx2 = chartRef2.current.getContext('2d');

    if (chartInstanceRef1.current) chartInstanceRef1.current.destroy();
    if (chartInstanceRef2.current) chartInstanceRef2.current.destroy();

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

    return () => {
      if (chartInstanceRef1.current) chartInstanceRef1.current.destroy();
      if (chartInstanceRef2.current) chartInstanceRef2.current.destroy();
    };
  }, []);

  return (
    <Container>
      <Row className="mt-5 mb-4 text-center">
        <Col md={6}>
          <div style={{ fontSize: '1rem' }}>Total Tickets: {totalTickets}</div>
          <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
            <canvas ref={chartRef1}></canvas>
          </div>
          <div style={{ fontSize: '1rem', marginTop: '10px' }}>
            <div>Completed: {completedTickets}</div>
            <div>Pending: {pendingTickets}</div>
          </div>
        </Col>
        <Col md={6}>
          <div style={{ fontSize: '1rem' }}>Total Tickets: {totalStatusTickets}</div>
          <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
            <canvas ref={chartRef2}></canvas>
          </div>
          <div style={{ fontSize: '1rem', marginTop: '10px' }}>
            <div>Active: {activeTickets}</div>
            <div>Inactive: {inactiveTickets}</div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col className="mt-2" style={{ fontSize: '1.2rem', fontWeight: '500' }}>Recently Added tickets</Col>
      </Row>
      <hr />

      <Row>
        <Col className="recent-ticket" style={{ fontSize: '1.1rem' }}>
          <TicketTable tickets={tickets} />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;