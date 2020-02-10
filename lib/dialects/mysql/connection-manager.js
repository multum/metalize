/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const utils = require('../../utils');
const BaseConnectionManager = require('../base/connectionManeger');

let lib;

class ConnectionManager extends BaseConnectionManager {
  constructor(metalize) {
    super();
    this.metalize = metalize;
    this._setup();
  }

  _setup() {
    const { _options } = this.metalize;
    if (_options.client) {
      this._client = _options.client;
    } else {
      lib = lib || this._loadDialectModule('mysql2/promise');
      this._connect = async () => {
        this._client = await lib.createConnection(_options.connectionConfig);
      };
      this._end = () => {
        const client = this._client;
        this._client = null;
        return client.end();
      };
    }
  }

  async query(sql) {
    if (!this._client) {
      await this._connect();
    }
    return this._client
      .query(sql)
      .then(([rows]) => rows)
      .then(rows => {
        if (rows) {
          return Array.isArray(rows)
            ? rows.map(utils.lowercaseKeys)
            : utils.lowercaseKeys(rows);
        } else {
          return rows;
        }
      });
  }
}

module.exports = ConnectionManager;
