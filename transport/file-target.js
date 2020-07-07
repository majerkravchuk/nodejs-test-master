'use strict';

const { createWriteStream } = require('fs');
const Abstract = require('./abstract');

class FileTarget extends Abstract {
  constructor(config) {
    super(config);
    this.config = config;
    this.stream = createWriteStream(this.config.path, {
      flags: 'w',
      encoding: 'utf8',
    });
  }
}

module.exports = FileTarget;
