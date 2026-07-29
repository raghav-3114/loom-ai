/**
 * @file app.js
 * @description Main Express application entry point. Initializes environment configuration, Express middleware,
 * SQLite database, API routes, and centralized error handling. Starts the server on the configured port.
 */

const express = require('express');
const cors = require('cors');
const { validateEnv } = require('./config/env');
const { logger } = require('./utils/logger');
const { initDatabase } = require('./db/init');
const { errorHandler } = require('./middleware/error-handler');

const generateRoutes = require('./routes/generate.routes');
const uploadRoutes = require('./routes/upload.routes');
const chatRoutes = require('./routes/chat.routes');
const downloadRoutes = require('./routes/download.routes');

// Fail-fast environment validation
const env = validateEnv();

const app = express();

// Standard middleware setup
app.use(cors());
app.use(express.json());

// Initialize SQLite database
initDatabase();

// Route mounting
app.use('/api/generate', generateRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/download', downloadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'Loom AI Backend',
    timestamp: new Date().toISOString()
  });
});

// Centralized error handling middleware
app.use(errorHandler);

const PORT = env.PORT || 3001;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Loom AI Server listening on port ${PORT}`);
  });
}

module.exports = app;
