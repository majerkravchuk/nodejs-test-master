'use strict';

const { pipeline } = require('stream');
const assert = require('assert');
const { readFileSync } = require('fs');
const Config = require('../config/file-to-file-with-filters.json');
const Source = require('../transport/file-source');
const Target = require('../transport/file-target');
const LogTransform = require('../transport/log-transform');

const source = new Source(Config.source);
const target = new Target(Config.target);
const parser = new LogTransform(Config.parser);

target.stream.on('unpipe', () => {
  const expected = readFileSync('data/to-with-filters-expected.txt');
  const got = readFileSync(Config.target.path);
  assert.equal(expected.toString(), got.toString());
  console.log('Test passed');
});

pipeline(
  source.stream,
  parser,
  target.stream,
  err => {
    if (err) {
      console.log('Pipeline failed: ')
    } else {
      console.log('Pipeline succeeded.')
    }
  }
)
