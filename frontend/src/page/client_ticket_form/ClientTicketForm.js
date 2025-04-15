import React, { useState } from "react";

const ClientTicketForm = () => {
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');

  const isFormValid = issue.trim() !== '' && description.trim() !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { issue, description });
    // Reset the form if needed
    setIssue('');
    setDescription('');
  };

  const containerStyle = {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  };

  const labelStyle = {
    fontWeight: "bold",
    marginBottom: "5px",
    display: "block",
    textAlign: "left",
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
    height: "20px",
    backgroundColor: "#ddd",
    marginBottom: "10px",
    borderRadius: "4px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: isFormValid ? "#FF4B2B" : "#FFD6D1",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: isFormValid ? "pointer" : "not-allowed",
  };

  return (
    <div style={containerStyle}>
      <h3>Client Ticket Form</h3>

      <label style={labelStyle}>ID</label>
      <div style={grayBoxStyle}></div>

      <label style={labelStyle}>Client Name</label>
      <div style={grayBoxStyle}></div>

      <label style={labelStyle}>Created Date</label>
      <div style={grayBoxStyle}></div>

      <label style={labelStyle}>Service Status</label>
      <div style={grayBoxStyle}></div>

      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>Issue Subject</label>
          <input
            type="text"
            value={issue}
            style={inputStyle}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="Enter issue subject here"
          />
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            style={inputStyle}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter issue description"
          />
        </div>

        <button type="submit" disabled={!isFormValid} style={buttonStyle}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ClientTicketForm;
