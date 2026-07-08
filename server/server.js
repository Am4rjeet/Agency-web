import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Models
import User from './models/User.js';
import Project from './models/Project.js';
import Booking from './models/Booking.js';
import Message from './models/Message.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/amarix')
  .then(() => console.log('Successfully connected to MongoDB database.'))
  .catch(err => console.error('MongoDB database connection error:', err));

// Custom In-Memory Rate Limiter to prevent brute force attacks on Login
const loginAttempts = {};
function loginRateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  const timeframe = 15 * 60 * 1000; // 15 minutes window

  if (!loginAttempts[ip]) {
    loginAttempts[ip] = [];
  }

  // Filter out attempts older than the timeframe window
  loginAttempts[ip] = loginAttempts[ip].filter(timestamp => now - timestamp < timeframe);

  if (loginAttempts[ip].length >= 5) {
    return res.status(429).json({ 
      message: 'Too many login attempts. Please try again after 15 minutes.' 
    });
  }

  loginAttempts[ip].push(now);
  next();
}

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token, access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is invalid or expired' });
    req.user = user;
    next();
  });
}

/* ==========================================================================
   AUTH ENDPOINTS
   ========================================================================== */

// Admin Login
app.post('/api/auth/login', loginRateLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  // Enforce string primitives to prevent NoSQL object injection queries
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Invalid payload formats' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

// Verify token validity
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});


/* ==========================================================================
   PROJECTS (PORTFOLIO) ENDPOINTS
   ========================================================================== */

// GET all projects (Public)
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects', error: err.message });
  }
});

// GET single project (Public)
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching project details', error: err.message });
  }
});

// POST new project (Secured Admin)
app.post('/api/projects', authenticateToken, async (req, res) => {
  const { title, client, category, metric, tech, desc, challenge, solution } = req.body;
  if (!title || !client || !category || !metric || !desc || !challenge || !solution) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const newProject = new Project({
      title, client, category, metric, tech, desc, challenge, solution
    });
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ message: 'Error saving project', error: err.message });
  }
});

// PUT update project (Secured Admin)
app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  const { title, client, category, metric, tech, desc, challenge, solution } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (title) project.title = title;
    if (client) project.client = client;
    if (category) project.category = category;
    if (metric) project.metric = metric;
    if (tech) project.tech = tech;
    if (desc) project.desc = desc;
    if (challenge) project.challenge = challenge;
    if (solution) project.solution = solution;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: 'Error updating project details', error: err.message });
  }
});

// DELETE project (Secured Admin)
app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project', error: err.message });
  }
});


/* ==========================================================================
   BOOKINGS (CONSULTATION) ENDPOINTS
   ========================================================================== */

// POST create consultation booking (Public)
app.post('/api/bookings', async (req, res) => {
  const { name, email, phone, company, service, budget, message, date, time } = req.body;
  if (!name || !email || !date || !time) {
    return res.status(400).json({ message: 'Name, email, date, and time are required' });
  }

  try {
    const newBooking = new Booking({
      name, email, phone, company, service, budget, message, date, time
    });
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ message: 'Error scheduling callback', error: err.message });
  }
});

// GET all bookings (Secured Admin)
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving bookings log', error: err.message });
  }
});

// DELETE booking (Secured Admin)
app.delete('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking entry not found' });

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking entry successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing booking log', error: err.message });
  }
});


/* ==========================================================================
   MESSAGES (CONTACT FORM) ENDPOINTS
   ========================================================================== */

// POST submit contact message (Public)
app.post('/api/messages', async (req, res) => {
  const { name, email, phone, company, service, budget, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  try {
    const newMessage = new Message({
      name, email, phone, company, service, budget, message
    });
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: 'Error submitting message log', error: err.message });
  }
});

// GET all contact messages (Secured Admin)
app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving messages logs', error: err.message });
  }
});

// DELETE contact message (Secured Admin)
app.delete('/api/messages/:id', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message record not found' });

    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message record successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting message log', error: err.message });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Express API Server running on port ${PORT}`);
});
