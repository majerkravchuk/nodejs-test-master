'use strict';

const _ = require('lodash');

const jsonParser = (line) => {
  const parsed = JSON.parse(line);
  const {
    app: program,
    environment: env,
    ip: host,
    error,
    message,
    timestamp,
  } = parsed;

  return {
    logsource: 'client',
    program,
    host,
    env,
    type: error ? 'ERROR' : 'INFO',
    timestamp: timestamp && new Date(timestamp * 1000).toISOString(),
    message: error || message,
    _data: _.omit(parsed, ['app', 'environment', 'type', 'ip', 'error', 'message', 'timestamp'])
  };
}

module.exports = jsonParser;
