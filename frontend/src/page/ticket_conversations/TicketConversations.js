import React from "react";

const TicketConversation = () => {
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
  };

  return (
    <div style={containerStyle}>
      <h3>Ticket Conversation</h3>

      <h4>Ticket Info</h4>
      <label style={labelStyle}>ID</label>
      <div style={grayBoxStyle}></div>

      <label style={labelStyle}>Client Name</label>
      <div style={grayBoxStyle}></div>

      <label style={labelStyle}>Created Date</label>
      <div style={grayBoxStyle}></div>

      <label style={labelStyle}>Service Status</label>
      <div style={grayBoxStyle}></div>

      <label style={labelStyle}>Issue Subject</label>
      <input type="text" style={inputStyle} />

      <label style={labelStyle}>Description</label>
      <input type="text" style={inputStyle} />

      <h4>Provided Solution</h4>
      <textarea style={{ ...inputStyle, height: "100px" }}></textarea>
    </div>
  );
};

export default TicketConversation;