/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const utils = require('../../utils');
const BaseConnectionManager = require('../base/connection-maneger');

let lib;

const _normalizeQueryResult = (result) => {
  const [rows] = result;
  if (rows) {
    return Array.isArray(rows)
      ? rows.map(utils.lowercaseKeys)
      : utils.lowercaseKeys(rows);
  } else {
    return rows;
  }
};

class ConnectionManager extends BaseConnectionManager {
  constructor(metalize) {
    super();
    this.metalize = metalize;
    lib = lib || this.loadDialectModule('mysql2/promise');
  }

  async getClient(options) {
    if (options.client) {
      return {
        query: (sql) => {
          return options.client.query(sql).then(_normalizeQueryResult);
        },
        end: () => {},
      };
    } else {
      const client = await lib.createConnection(
        this.metalize.options.connectionConfig
      );
      return {
        query: (sql) => {
          return client.query(sql).then(_normalizeQueryResult);
        },
        end: () => client.end(),
      };
    }
  }
}

module.exports = ConnectionManager;
