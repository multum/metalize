/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const helpers = require('../common/helpers');

const lib = helpers.getManuallyInstalledModule('mysql2/promise');

class ConnectionManager {
  static async getClient(options) {
    if (options.client) {
      return {
        query: (sql) => options.client.query(sql),
        end: () => Promise.resolve(),
      };
    } else {
      return lib.createConnection(options.connectionConfig);
    }
  }
}

module.exports = ConnectionManager;
