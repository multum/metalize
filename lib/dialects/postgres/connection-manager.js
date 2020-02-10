/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

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
      lib = lib || this._loadDialectModule('pg');
      this._connect = () => {
        const { Client } = lib;
        this._client = new Client(_options.connectionConfig);
        return this._client.connect();
      };
      this._end = () => {
        const client = this._client;
        this._client = null;
        return client.end();
      };
    }
  }

  query(sql) {
    if (!this._client) {
      this._connect();
    }
    return this._client.query(sql);
  }
}

module.exports = ConnectionManager;
