const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const routes = require('./routes');
const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler.middleware');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json()); // Essential for Task 1: Receiving JSON signatures

// Logger for incoming requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Task 1: API Routes
app.use('/api', routes);

// Serve static React files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Error Handling (Must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 Institutional Server running at http://localhost:${PORT}`);
});
