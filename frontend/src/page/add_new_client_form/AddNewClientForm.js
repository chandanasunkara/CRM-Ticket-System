import React, { useState } from "react";

const AddNewClient = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        serviceType: "",
        startDate: "",
        address: ""
    });

    const isFormValid = Object.values(formData).every(field => field.trim() !== "") && emailIsValid(formData.email) && phoneIsValid(formData.phone);

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
        <div style={{ 
            maxWidth: "500px", 
            margin: "40px auto", 
            padding: "20px", 
            border: "1px solid #ddd", 
            borderRadius: "10px", 
            boxShadow: "0px 2px 10px rgba(0,0,0,0.1)", 
            backgroundColor: "#fff" 
          }}>
          
            <h3>Add New Client</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Name</label>
                    <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        pattern="[A-Za-z ]+"
                        required
                        style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Email</label>
                    <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Phone</label>
                    <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        required
                        style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Service Type</label>
                    <input 
                        type="text"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Start Date</label>
                    <input 
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px", border: "1px solid #ccc", height: "60px" }}
                    />
                </div>
                <button type="submit" disabled={!isFormValid} style={{ 
                    width: "100%", 
                    marginBottom: "10px",
                    padding: "10px", 
                    backgroundColor: isFormValid ? "#28a745" : "#c3e6cb", 
                    border: "1px solid #28a745", 
                    color: "#fff",
                    cursor: isFormValid ? "pointer" : "not-allowed" 
                }}>
                    Add New Client
                </button>
            </form>
        </div>
    );

    function emailIsValid(email) {
        return /([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\.([a-zA-Z]{2,5})$/.test(email);

    }

    function phoneIsValid(phone) {
        return /^[0-9]{10}$/.test(phone);
    }

};

export default AddNewClient;