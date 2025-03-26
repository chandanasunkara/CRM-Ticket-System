import React, { useState } from "react";

const AddNewClient = () => {
    const [formData, setFormData] = useState({
        Name: "",
        Email: "",
        Phone: "",
        ServiceType: "",
        StartDate: "",
        Address: ""
    });

    const isFormValid = Object.values(formData).every(field => field.trim() !== "");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            console.log("Client Added", formData);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto" }}>
            <h3>Add New Client</h3>
            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map((field) => (
                    <div key={field} style={{ marginBottom: "10px" }}>
                        <label style={{ display: "block" }}>{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                        <input 
                            type="text"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
                        />
                    </div>
                ))}
                <button type="submit" disabled={!isFormValid} style={{ 
                    width: "100%", 
                    marginBottom: "10px",
                    padding: "10px", 
                    backgroundColor: isFormValid ? "#ffcccc" : "#f8d7da", 
                    border: "1px solid #f5c6cb", 
                    cursor: isFormValid ? "pointer" : "not-allowed" 
                }}>
                    Add New Client
                </button>
            </form>
        </div>
    );
};

export default AddNewClient;