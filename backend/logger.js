const { createLogger, format, transports } = require('winston');
const path = require('path');

// Create a logger instance
const logger = createLogger({
  level: 'info', // Default log level
  format: format.combine(
    format.timestamp(), // Include timestamp in logs
    format.json() // Log output in JSON format
  ),
  transports: [
    // Log to a file
    new transports.File({ filename: path.join(__dirname, 'logs', 'app.log') }),
    // Log to the console (optional, can be removed if you only want file logging)
    new transports.Console()
  ]
});

// Optional: Handle unhandled exceptions
logger.exceptions.handle(
  new transports.File({ filename: path.join(__dirname, 'logs', 'exceptions.log') })
);

// Optional: Handle unhandled rejections
logger.rejections.handle(
  new transports.File({ filename: path.join(__dirname, 'logs', 'rejections.log') })
);

module.exports = logger; // Export the logger
