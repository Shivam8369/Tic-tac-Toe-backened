require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const gameRoutes = require('./routes/game.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/',(req,res)=>{
  res.json({
    success:true,
    message:"Server is running"
  })
})

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

// Error handling
app.use(errorHandler);



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});