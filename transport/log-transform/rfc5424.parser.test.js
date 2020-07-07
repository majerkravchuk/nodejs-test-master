'use strict';

const parser = require('./rfc5424.parser');

describe('rfc5424.parser', () => {
  describe('transforms rfc5424 logs to the desired format', () => {
    it('error type', () => {
      expect(
        parser(
          '<11>1 2003-10-11T22:14:15.003Z 127.0.0.1 app 10000 - - ERROR'
        )
      ).toEqual(
        {
          logsource: 'server',
          program: 'app',
          host: '127.0.0.1',
          type: 'ERROR',
          timestamp: '2003-10-11T22:14:15.003Z',
          message: 'ERROR',
          _data: {}
        }
      )
    })

    it('warning type with structuredData', () => {
      expect(
        parser(
          '<12>1 - - app 10000 - [info@app env="prod" type="server" some="data"][data@app some="data"] WARNING'
        )
      ).toEqual(
        {
          logsource: 'server',
          program: 'app',
          env: 'prod',
          type: 'WARNING',
          message: 'WARNING',
          _data: {
            info: {
              some: 'data'
            },
            data: {
              some: 'data'
            }
          }
        }
      );
    });
  });
});
