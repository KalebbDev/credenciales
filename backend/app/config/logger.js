const { createLogger, transports, format } = require('winston');

const options = {
  file: {
    filename: `/usr/src/app/logs/app.log`,
    maxsize: 5242880, // 5MB
    maxFiles: 10,
  },
};

// instantiate a new Winston Logger with the settings defined above
const logger = new createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.File(options.file), new transports.Console()],
});

module.exports = logger;
