'use strict';

class Abstract {
  constructor(config) {
    /**
     * @type {object}
     */
    this.config = config;
    /**
     * @type {Stream}
     */
    this.stream = null;
  }
}

module.exports = Abstract;
