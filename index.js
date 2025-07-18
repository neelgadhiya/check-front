const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Configure CORS to allow requests from your frontend
app.use(cors());
app.use(express.json());

// MongoDB connection using environment variables
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://admin:neel@vericluster.tiod2hf.mongodb.net/?retryWrites=true&w=majority&appName=VeriCluster';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// API to add a user
app.post('/api/users', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const user = new User({ name });
    await user.save();
    res.status(201).json({ message: 'User added', user });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// API to get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    console.log(users)
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Export the app for Vercel
module.exports = app;
