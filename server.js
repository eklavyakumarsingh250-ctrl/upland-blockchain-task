const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler.middleware');

const app = express();
const PORT = process.env.PORT || 3002;

// 1. Essential Middleware
app.use(cors());
app.use(express.json()); // CRITICAL for Task 1: Handling JSON signatures

// 2. Request Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// 3. Task 1 & 2: API Routing
app.use('/api', routes);

// 4. Production Static Hosting
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'src/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/build', 'index.html'));
  });
}

// 5. Centralized Error Handling (Task 2 Safety)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 Upland Blockchain Server live at http://localhost:${PORT}`);
});
