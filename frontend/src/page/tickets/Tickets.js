import React from "react";

const Tickets = () => {
    const tickets = [
        // placeholder
        { id: 341, name: "Walmart", status: "Active", lastUpdated: "06-03-2025" }
    ];

    return (
        <div style={{ maxWidth: "800px", margin: "auto" }}>
            <h3>Tickets</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#ffeeee" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f8c6c6", textAlign: "left" }}>
                        <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Id</th>
                        <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Name</th>
                        <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Service Status</th>
                        <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Last Updated</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket) => (
                        <tr key={ticket.id} style={{ borderBottom: "1px solid #ddd" }}>
                            <td style={{ padding: "10px" }}>{ticket.id}</td>
                            <td style={{ padding: "10px" }}>{ticket.name}</td>
                            <td style={{ padding: "10px" }}>{ticket.status}</td>
                            <td style={{ padding: "10px" }}>{ticket.lastUpdated}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Tickets;