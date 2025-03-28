require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Import the MongoDB connection

const app = express();
app.use(express.json());
app.use(cors());

console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Ticket API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
