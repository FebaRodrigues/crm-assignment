// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const customerRoutes = require('./routes/customerRoutes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5051; // Use PORT from .env or default to 5050

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB using the URI from .env
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Database connected successfully'))
.catch(err => console.error(err));

// Routes
app.use('/api/customers', customerRoutes);

// Error handling middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));