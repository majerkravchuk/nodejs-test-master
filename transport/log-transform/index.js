'use strict'

const { Transform } = require('stream');
const _ = require('lodash');
const jsonParser = require('./json.parser');
const rfc425Parser = require('./rfc5424.parser');

const FORMATS = {
  JSON: /^{.*:.*}$/,
  RFC5424: /^<\d+>/,
  STACK_TRACE_START: /^\S+/,
}

class LogTransform extends Transform {
  constructor(options = {}) {
    super(_.omit(options, ['types']));

    this._types = options.types || null;
    this._lineBuffer = '';
    this._stackTraceBuffer = [];
    this._lastEvent = null;
  }

  push(data) {
    if (!_.isObject(data)) return super.push(data);
    if (this._types && !this._types.includes(data.type)) return;
    super.push(JSON.stringify(data) + '\n');
  }

  _transform(chunk, encoding, done) {
    this._lineBuffer += chunk;

    if (/\n/.test(this._lineBuffer)) {
      const lines = this._lineBuffer.split(/\n/);

      if (lines.length > 1 && _.last(lines)) {
        this._lineBuffer = lines.pop();
      }

      lines.forEach((line) => {
        if (!line) return

        if (FORMATS.JSON.test(line)) {
          this._pushStackTraceFromBuffer();
          this._lastEvent = jsonParser(line);
          this.push(this._lastEvent);

        } else if (FORMATS.RFC5424.test(line)) {
          this._pushStackTraceFromBuffer();
          this._lastEvent = rfc425Parser(line);
          this.push(this._lastEvent);

        } else if (FORMATS.STACK_TRACE_START.test(line)) {
          this._pushStackTraceFromBuffer();
          this._stackTraceBuffer.push(line.trim());

        } else {
          this._stackTraceBuffer.push(line.trim());
        }
      })
    }

    done();
  }

  _flush(done) {
    this._pushStackTraceFromBuffer();
    done();
  }

  _pushStackTraceFromBuffer() {
    if (this._stackTraceBuffer.length < 1) return;
    this.push({
      type: 'ERROR',
      timestamp: this._lastEvent && this._lastEvent['timestamp'],
      message: this._stackTraceBuffer.join(' | ')
    });
    this._stackTraceBuffer = [];
  }
}

module.exports = LogTransform;
