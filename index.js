// api/users.js
const mongoose = require('mongoose');

let conn = null;

// Connect to MongoDB Atlas only once (reuse connection)
async function connectToDatabase() {
  if (conn == null) {
    conn = await mongoose.connect(
      'mongodb+srv://admin:neel@vericluster.tiod2hf.mongodb.net/?retryWrites=true&w=majority&appName=VeriCluster',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  }
  return conn;
}

// Define schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

// Avoid model overwrite on re-import
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Serverless API function
export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'POST') {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const user = new User({ name });
    await user.save();
    return res.status(201).json({ message: 'User added', user });
  }

  if (req.method === 'GET') {
    const users = await User.find();
    return res.status(200).json(users);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
