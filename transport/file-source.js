'use strict';

const { createReadStream } = require('fs');
const Abstract = require('./abstract');

class FileSource extends Abstract {
  constructor(config) {
    super(config);
    this.config = config;
    this.stream = createReadStream(this.config.path, {
      flags: 'r',
      encoding: 'utf8'
    });
  }
}

module.exports = FileSource;
