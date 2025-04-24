import React from "react";
import { useParams } from "react-router-dom";
import tickets from "../../assets/data/dummy-tickets.json"; // Adjust path if needed

const TicketConversation = () => {
  const { tId } = useParams(); // get ticket id from URL
  const ticket = tickets.find(t => t.id === parseInt(tId));

  const containerStyle = {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  };

  const labelStyle = {
    fontWeight: "bold",
    marginBottom: "5px",
    display: "block",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const grayBoxStyle = {
    width: "100%",
    height: "40px",
    backgroundColor: "#ddd",
    marginBottom: "10px",
    borderRadius: "4px",
    padding: "8px",
  };

  if (!ticket) return <div style={containerStyle}>Ticket not found.</div>;

  return (
    <div style={containerStyle}>
      <h3>Ticket Conversation</h3>

      <h4>Ticket Info</h4>
      <label style={labelStyle}>ID</label>
      <div style={grayBoxStyle}>{ticket.id}</div>

      <label style={labelStyle}>Client Name</label>
      <div style={grayBoxStyle}>{ticket.clientName || "Client Name Placeholder"}</div>

      <label style={labelStyle}>Created Date</label>
      <div style={grayBoxStyle}>{ticket.addedAt}</div>

      <label style={labelStyle}>Service Status</label>
      <div style={grayBoxStyle}>{ticket.status}</div>

      <label style={labelStyle}>Issue Subject</label>
      <input type="text" value={ticket.subject} style={inputStyle} readOnly />

      <label style={labelStyle}>Description</label>
      <input type="text" value={ticket.description || "Description not available"} style={inputStyle} readOnly />

      <h4>Provided Solution</h4>
      <textarea style={{ ...inputStyle, height: "100px" }} readOnly value={ticket.solution || "Solution pending..."} />

      {ticket.history && (
        <>
          <h4 style={{ marginTop: "30px" }}>Conversation History</h4>
          {ticket.history.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: "15px" }}>
              <p style={{ margin: 0 }}>
                <strong>{msg.messageBy} ({msg.date}):</strong>
              </p>
              <p style={{ margin: "5px 0" }}>{msg.message}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default TicketConversation;
