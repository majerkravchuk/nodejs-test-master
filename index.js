'use strict';

const Config = require('./config/file-to-file.json');
const Source = require('./transport/file-source');
const Target = require('./transport/file-target');

const source = new Source(Config.source);
const target = new Target(Config.target);

source.stream.pipe(target.stream);
