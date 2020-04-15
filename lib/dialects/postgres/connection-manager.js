/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const helpers = require('../common/helpers');

const { Client } = helpers.getManuallyInstalledModule('pg');

class ConnectionManager {
  static async getClient(options) {
    if (options.client) {
      return {
        query: (sql) => options.client.query(sql),
        end: () => Promise.resolve(),
      };
    } else {
      const client = new Client(options.connectionConfig);
      await client.connect();
      return client;
    }
  }
}

module.exports = ConnectionManager;
