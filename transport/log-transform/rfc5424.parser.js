'use strict';

const _ = require('lodash');
const parser = require("nsyslog-parser");

const parseType = (levelval) => {
  if (_.inRange(levelval, 0, 4)) {
    return 'ERROR';

  } else if (levelval === 4) {
    return 'WARNING';

  } else if (_.inRange(levelval, 5, 7)) {
    return 'INFO';
  }

  return 'DEBUG';
};

const rfc5424Parser = (line) => {
  const parsed = parser(line, {
    generateTimestamp: false
  });

  const {
    host,
    levelval,
    message,
    structuredData,
    appName: program,
    ts: timestamp
  } = parsed;

  const env = (_.find(structuredData, (item) => item['$id'].startsWith('info@')) || {}).env;

  return _.pickBy({
    logsource: 'server',
    program,
    host,
    env,
    type: parseType(levelval),
    timestamp: timestamp && new Date(timestamp).toISOString(),
    message,
    _data: _.reduce(
      structuredData,
      (acc, obj) => _.set(acc, obj.$id.split('@')[0], _.omit(obj, ['$id', 'env', 'type'])),
      {}
    )
  }, value => value !== '-');
};

module.exports = rfc5424Parser;
