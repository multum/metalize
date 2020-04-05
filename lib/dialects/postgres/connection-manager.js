/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const BaseConnectionManager = require('../base/connection-maneger');

let lib;

class ConnectionManager extends BaseConnectionManager {
  constructor(metalize) {
    super();
    this.metalize = metalize;
    lib = lib || this.loadDialectModule('pg');
  }

  async getClient(options) {
    if (options.client) {
      return {
        query: (sql) => options.client.query(sql),
        end: () => {},
      };
    } else {
      const client = new lib.Client(this.metalize.options.connectionConfig);
      await client.connect();
      return {
        query: (sql) => client.query(sql),
        end: () => client.end(),
      };
    }
  }
}

module.exports = ConnectionManager;
