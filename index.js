const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');  // ✅ Import your route

dotenv.config();                           // ✅ Load environment variables
connectDB();                               // ✅ Connect to MongoDB

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Use your userRoutes here
app.use('/api/users', userRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

