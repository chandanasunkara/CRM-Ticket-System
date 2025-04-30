import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

export const TicketTable = ({ tickets }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Subject</th>
          <th>Status</th>
          <th>Opened Date</th>
        </tr>
      </thead>
      <tbody>
        {tickets.length ? (
          tickets.map((row) => (
            <tr key={row._id}>
              <td>{row._id.substring(18, 24)}</td>
              <td>
                <Link to={`/ticket/${row._id}`}>{row.subject}</Link>
              </td>
              <td>{row.status}</td>
              <td>{new Date(row.createdAt).toLocaleDateString()}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center">
              No Tickets to show
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};
