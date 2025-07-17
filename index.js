const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://admin:neel@vericluster.tiod2hf.mongodb.net/?retryWrites=true&w=majority&appName=VeriCluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// API to add a user
app.post('/api/users', async (req, res) => {
  try {
    const { name } = req.body;
    const user = new User({ name });
    await user.save();
    res.status(201).json({ message: 'User added', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// API to get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));