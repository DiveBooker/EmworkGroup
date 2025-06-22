const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const { testDbConnection } = require('./config/db');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Test DB Connection
testDbConnection();

// Routes
app.use('/api/transactions', transactionRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Financial Tracker API is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access API at http://localhost:${PORT}/api/transactions`);
});