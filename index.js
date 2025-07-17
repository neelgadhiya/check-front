// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express app
const app = express();

// CORS config – allow frontend
app.use(cors({
  origin: ['https://check-front.vercel.app'], // frontend domain
  methods: ['GET', 'POST'],
  credentials: true,
}));

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
mongoose.connect(
  'mongodb+srv://admin:neel@vericluster.tiod2hf.mongodb.net/?retryWrites=true&w=majority&appName=VeriCluster',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// User Schema & Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Route: Add user
app.post('/api/users', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const user = new User({ name });
    await user.save();
    res.status(201).json({ message: 'User added', user });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Route: Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
