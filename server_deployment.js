const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load sample data
const sampleData = require('./utils/sampleData');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../../frontend')));

// MongoDB connection string - will be updated during deployment
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ed_tracking_system';

// JWT secret - will be updated during deployment
const JWT_SECRET = process.env.JWT_SECRET || 'ed_tracking_system_secret_key';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    // If MongoDB connection fails, use in-memory data store
    console.log('Using in-memory data store for demonstration');
  });

// Define simplified schemas for deployment
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: String,
    enum: ['admin', 'doctor', 'nurse', 'triage']
  }
});

const patientSchema = new mongoose.Schema({
  uhid: {
    type: String,
    unique: true
  },
  name: String,
  age: Number,
  gender: String,
  contactNumber: String,
  address: String,
  emergencyContact: String
});

const visitSchema = new mongoose.Schema({
  patient: {
    type: String,
    ref: 'Patient'
  },
  arrivalTime: Date,
  chiefComplaint: String,
  zone: {
    type: String,
    enum: ['red', 'yellow-a', 'yellow-b', 'green']
  },
  status: {
    type: String,
    enum: ['waiting', 'in-treatment', 'awaiting-results', 'ready-for-discharge', 'discharged', 'admitted', 'transferred']
  },
  provider: String,
  quickAlert: {
    type: {
      type: String,
      enum: ['STEMI', 'STROKE', 'TRAUMA']
    },
    activatedAt: Date,
    doorToECGTime: Number,
    doorToCTTime: Number,
    doorToNeedleTime: Number
  },
  mobilityStatus: {
    type: String,
    enum: ['ambulatory', 'wheelchair', 'stretcher']
  }
});

const vitalSignsSchema = new mongoose.Schema({
  visit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visit'
  },
  recordedAt: Date,
  recordedBy: String,
  pulseRate: Number,
  respiratoryRate: Number,
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  temperature: Number,
  oxygenSaturation: Number,
  painScore: Number
});

const noteSchema = new mongoose.Schema({
  visit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visit'
  },
  createdAt: Date,
  createdBy: String,
  noteType: {
    type: String,
    enum: ['physician', 'nurse', 'procedure', 'consultation']
  },
  content: String
});

const orderSchema = new mongoose.Schema({
  visit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visit'
  },
  orderedAt: Date,
  orderedBy: String,
  orderType: {
    type: String,
    enum: ['medication', 'laboratory', 'imaging', 'procedure']
  },
  details: String,
  status: {
    type: String,
    enum: ['ordered', 'in-progress', 'completed', 'cancelled']
  },
  completedAt: Date,
  result: String
});

// Create models
const User = mongoose.model('User', userSchema);
const Patient = mongoose.model('Patient', patientSchema);
const Visit = mongoose.model('Visit', visitSchema);
const VitalSigns = mongoose.model('VitalSigns', vitalSignsSchema);
const Note = mongoose.model('Note', noteSchema);
const Order = mongoose.model('Order', orderSchema);

// In-memory data stores (fallback if MongoDB connection fails)
let memoryUsers = [];
let memoryPatients = [];
let memoryVisits = [];
let memoryVitalSigns = [];
let memoryNotes = [];
let memoryOrders = [];

// Initialize sample data
async function initializeSampleData() {
  try {
    // Check if data already exists
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('Initializing sample data...');
      
      // Hash passwords for users
      const hashedUsers = await Promise.all(sampleData.users.map(async user => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword
        };
      }));
      
      // Insert sample data into MongoDB
      await User.insertMany(hashedUsers);
      await Patient.insertMany(sampleData.patients);
      
      // Create visits and get their IDs
      const createdVisits = await Visit.insertMany(sampleData.visits);
      
      // Update vital signs, notes, and orders with actual visit IDs
      const updatedVitalSigns = sampleData.vitalSigns.map(vs => ({
        ...vs,
        visit: createdVisits[vs.visit]._id
      }));
      
      const updatedNotes = sampleData.notes.map(note => ({
        ...note,
        visit: createdVisits[note.visit]._id
      }));
      
      const updatedOrders = sampleData.orders.map(order => ({
        ...order,
        visit: createdVisits[order.visit]._id
      }));
      
      await VitalSigns.insertMany(updatedVitalSigns);
      await Note.insertMany(updatedNotes);
      await Order.insertMany(updatedOrders);
      
      console.log('Sample data initialized successfully');
    } else {
      console.log('Sample data already exists');
    }
    
    // Also initialize in-memory data for fallback
    memoryUsers = sampleData.users;
    memoryPatients = sampleData.patients;
    memoryVisits = sampleData.visits;
    memoryVitalSigns = sampleData.vitalSigns;
    memoryNotes = sampleData.notes;
    memoryOrders = sampleData.orders;
    
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
}

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Check if MongoDB is connected
      if (mongoose.connection.readyState === 1) {
        req.user = await User.findById(decoded.id);
      } else {
        // Use in-memory data
        req.user = memoryUsers.find(user => user._id === decoded.id);
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// API Routes

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    
    let user;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email });
    } else {
      // Use in-memory data
      user = memoryUsers.find(u => u.email === email);
    }
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/v1/auth/me
// @desc    Get current user
// @access  Private
app.get('/api/v1/auth/me', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// @route   GET /api/v1/patients
// @desc    Get all patients
// @access  Private
app.get('/api/v1/patients', authenticate, async (req, res) => {
  try {
    let patients;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      patients = await Patient.find();
    } else {
      // Use in-memory data
      patients = memoryPatients;
    }
    
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/v1/patients/:id
// @desc    Get single patient
// @access  Private
app.get('/api/v1/patients/:id', authenticate, async (req, res) => {
  try {
    let patient;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      patient = await Patient.findById(req.params.id);
    } else {
      // Use in-memory data
      patient = memoryPatients.find(p => p._id === req.params.id);
    }
    
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/v1/visits/zone/:zone
// @desc    Get visits by zone
// @access  Private
app.get('/api/v1/visits/zone/:zone', authenticate, async (req, res) => {
  try {
    const { zone } = req.params;
    
    if (!['red', 'yellow-a', 'yellow-b', 'green'].includes(zone)) {
      return res.status(400).json({ success: false, message: 'Invalid zone' });
    }
    
    let visits;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      visits = await Visit.find({ zone }).populate('patient');
    } else {
      // Use in-memory data
      visits = memoryVisits.filter(v => v.zone === zone);
      
      // Add patient data
      visits = visits.map(visit => {
        const patient = memoryPatients.find(p => p.uhid === visit.patient);
        return {
          ...visit,
          patient
        };
      });
    }
    
    res.status(200).json({
      success: true,
      count: visits.length,
      data: visits
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/v1/visits/:visitId/vitals
// @desc    Get vital signs for a visit
// @access  Private
app.get('/api/v1/visits/:visitId/vitals', authenticate, async (req, res) => {
  try {
    const { visitId } = req.params;
    
    let vitalSigns;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      vitalSigns = await VitalSigns.find({ visit: visitId }).sort({ recordedAt: -1 });
    } else {
      // Use in-memory data
      vitalSigns = memoryVitalSigns.filter(vs => vs.visit.toString() === visitId);
      vitalSigns.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));
    }
    
    res.status(200).json({
      success: true,
      count: vitalSigns.length,
      data: vitalSigns
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/v1/visits/:visitId/notes
// @desc    Get notes for a visit
// @access  Private
app.get('/api/v1/visits/:visitId/notes', authenticate, async (req, res) => {
  try {
    const { visitId } = req.params;
    
    let notes;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      notes = await Note.find({ visit: visitId }).sort({ createdAt: -1 });
    } else {
      // Use in-memory data
      notes = memoryNotes.filter(note => note.visit.toString() === visitId);
      notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/v1/visits/:visitId/orders
// @desc    Get orders for a visit
// @access  Private
app.get('/api/v1/visits/:visitId/orders', authenticate, async (req, res) => {
  try {
    const { visitId } = req.params;
    
    let orders;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      orders = await Order.find({ visit: visitId }).sort({ orderedAt: -1 });
    } else {
      // Use in-memory data
      orders = memoryOrders.filter(order => order.visit.toString() === visitId);
      orders.sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt));
    }
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Serve frontend for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// Initialize sample data
initializeSampleData();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
