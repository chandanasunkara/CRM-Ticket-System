require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Import the MongoDB connection
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { metricsRoute } = require('./middleware/metrics');

const User = require('./models/Users.js')


const app = express();
app.use(express.json());
app.use(cors());
app.use(metricsRoute)

console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Ticket API is running!");
});

app.post("/register", async (req, res) => {
  try {
    console.log("test test test")
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: hashedPassword
    });
    console.log("Creating new user with username: " + req.body.username);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({message: "Error creating user", error: err})
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({message: "Error fetching users", error: err})
  } 
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
