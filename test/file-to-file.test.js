'use strict';

const { readFileSync } = require('fs');
const { pipeline } = require('stream');
const { resolve } = require('path');

const Source = require('../transport/file-source');
const Target = require('../transport/file-target');
const LogTransform = require('../transport/log-transform');

const promisefyPipeline = (source, parser, target) => {
  return new Promise((resolve, reject) => {
    pipeline(
      source.stream,
      parser,
      target.stream,
      err => {
        if (err) {
          reject(err);
        } else {
          // I know, it's a bit ugly, but for a quick test in a test task - does its job xD
          resolve(readFileSync(target.config.path).toString());
        }
      }
    )
  });
}

describe('file-to-file', () => {
  describe('reads data from source.txt and writes parsed logs into output file', () => {
    it('transforms logs to the desired format', async () => {
      const promise = promisefyPipeline(
        new Source({
          type: 'file',
          path: resolve(__dirname, './data/source.txt')
        }),
        new LogTransform(),
        new Target({
          type: 'file',
          path: resolve(__dirname, './data/file-to-file.test-output.txt')
        })
      );
      await expect(promise).resolves.toMatchSnapshot();
    });

    it('filters logs', async () => {
      const promise = promisefyPipeline(
        new Source({
          type: 'file',
          path: resolve(__dirname, './data/source.txt')
        }),
        new LogTransform({
          types: [
            'ERROR',
            'WARNING'
          ]
        }),
        new Target({
          type: 'file',
          path: resolve(__dirname, './data/file-to-file-with-filters.test-output.txt')
        })
      );
      await expect(promise).resolves.toMatchSnapshot();
    });
  });
});

