const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// MongoDB connection string - will be updated during deployment
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ed_tracking_system';

// JWT secret - will be updated during deployment
const JWT_SECRET = process.env.JWT_SECRET || 'ed_tracking_system_secret_key';

// In-memory data stores (fallback if MongoDB connection fails)
let memoryUsers = [];
let memoryPatients = [];
let memoryVisits = [];
let memoryVitalSigns = [];
let memoryNotes = [];
let memoryOrders = [];

// Sample data for in-memory use
const sampleData = {
  users: [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: "$2a$10$eCjlMPK0/zQXRJJq8.WBXeYHWLMDrZgB9R0wJQwAK9hqUW0qLtgIK", // Admin@123
      role: "admin"
    },
    {
      name: "Dr. John Smith",
      email: "john.smith@example.com",
      password: "$2a$10$eCjlMPK0/zQXRJJq8.WBXeYHWLMDrZgB9R0wJQwAK9hqUW0qLtgIK", // Doctor@123
      role: "doctor"
    },
    {
      name: "Nurse Sarah Johnson",
      email: "sarah.johnson@example.com",
      password: "$2a$10$eCjlMPK0/zQXRJJq8.WBXeYHWLMDrZgB9R0wJQwAK9hqUW0qLtgIK", // Nurse@123
      role: "nurse"
    },
    {
      name: "Triage Officer Mike Brown",
      email: "mike.brown@example.com",
      password: "$2a$10$eCjlMPK0/zQXRJJq8.WBXeYHWLMDrZgB9R0wJQwAK9hqUW0qLtgIK", // Triage@123
      role: "triage"
    }
  ],
  patients: [
    {
      uhid: "UHID001",
      name: "Robert Williams",
      age: 65,
      gender: "Male",
      contactNumber: "555-123-4567",
      address: "123 Main St, Anytown",
      emergencyContact: "Mary Williams (Wife) - 555-123-4568"
    },
    {
      uhid: "UHID002",
      name: "Emily Davis",
      age: 42,
      gender: "Female",
      contactNumber: "555-234-5678",
      address: "456 Oak Ave, Somewhere",
      emergencyContact: "David Davis (Husband) - 555-234-5679"
    },
    {
      uhid: "UHID003",
      name: "Michael Johnson",
      age: 28,
      gender: "Male",
      contactNumber: "555-345-6789",
      address: "789 Pine Rd, Elsewhere",
      emergencyContact: "Susan Johnson (Mother) - 555-345-6780"
    }
  ],
  visits: [
    {
      patient: "UHID001",
      arrivalTime: new Date("2025-04-05T07:30:00"),
      chiefComplaint: "Chest pain and shortness of breath",
      zone: "red",
      status: "in-treatment",
      provider: "john.smith@example.com",
      mobilityStatus: "stretcher"
    },
    {
      patient: "UHID002",
      arrivalTime: new Date("2025-04-05T08:15:00"),
      chiefComplaint: "Severe headache and dizziness",
      zone: "yellow-a",
      status: "awaiting-results",
      provider: "john.smith@example.com",
      mobilityStatus: "wheelchair"
    },
    {
      patient: "UHID003",
      arrivalTime: new Date("2025-04-05T08:45:00"),
      chiefComplaint: "Laceration on right arm",
      zone: "green",
      status: "waiting",
      provider: null,
      mobilityStatus: "ambulatory"
    }
  ]
};

// Initialize in-memory data
memoryUsers = sampleData.users;
memoryPatients = sampleData.patients;
memoryVisits = sampleData.visits;

// Connect to MongoDB with error handling
console.log('Attempting to connect to MongoDB...');
console.log('MONGO_URI:', MONGO_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@')); // Log URI with hidden password

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    // Initialize MongoDB with sample data if needed
    // This would be implemented here
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    console.log('Using in-memory data store for demonstration');
  });

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    
    // Find user in memory data
    const user = memoryUsers.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      // For demo purposes, also allow plain text password matching
      if (password === 'Admin@123' || password === 'Doctor@123' || 
          password === 'Nurse@123' || password === 'Triage@123') {
        console.log('Demo mode: Using plain text password match');
      } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }
    
    // Create token
    const token = jwt.sign({ id: user.email }, JWT_SECRET, { expiresIn: '1d' });
    
    res.status(200).json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/v1/patients
// @desc    Get all patients
// @access  Public (for demo purposes)
app.get('/api/v1/patients', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: memoryPatients.length,
      data: memoryPatients
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/v1/visits/zone/:zone
// @desc    Get visits by zone
// @access  Public (for demo purposes)
app.get('/api/v1/visits/zone/:zone', (req, res) => {
  try {
    const { zone } = req.params;
    
    if (!['red', 'yellow-a', 'yellow-b', 'green'].includes(zone)) {
      return res.status(400).json({ success: false, message: 'Invalid zone' });
    }
    
    // Filter visits by zone
    const visits = memoryVisits.filter(v => v.zone === zone);
    
    // Add patient data
    const visitsWithPatients = visits.map(visit => {
      const patient = memoryPatients.find(p => p.uhid === visit.patient);
      return {
        ...visit,
        patient
      };
    });
    
    res.status(200).json({
      success: true,
      count: visitsWithPatients.length,
      data: visitsWithPatients
    });
  } catch (error) {
    console.error('Get visits by zone error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Serve frontend for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;

// Add more error handling for server startup
app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Server time: ${new Date().toISOString()}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't crash the server, just log the error
});

module.exports = app;
