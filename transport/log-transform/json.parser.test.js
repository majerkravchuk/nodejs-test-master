'use strict';

const parser = require('./json.parser');

describe('json.parser', () => {
  describe('transforms json logs to the desired format', () => {
    it('error type', () => {
      expect(
        parser(
          '{"type": "client", "error": "An application event log entry..", "timestamp": 1518176440, "user_id": 1, "environment": "prod"}'
        )
      ).toEqual({
        logsource: 'client',
        env: 'prod',
        type: 'ERROR',
        timestamp: '2018-02-09T11:40:40.000Z',
        message: 'An application event log entry..',
        _data: {
          user_id: 1
        }
      });
    });

    it('message type', () => {
      expect(
        parser(
          '{"type": "client", "message": "An application event log entry..", "timestamp": 1518176440, "user_id": 1, "environment": "prod", "ip": "127.0.0.1", "app": "client_app"}'
        )
      ).toEqual({
        logsource: 'client',
        program: 'client_app',
        host: '127.0.0.1',
        env: 'prod',
        type: 'INFO',
        timestamp: '2018-02-09T11:40:40.000Z',
        message: 'An application event log entry..',
        _data: {
          user_id: 1
        }
      });
    })
  });
});
