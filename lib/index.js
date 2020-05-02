/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const Result = require('./result');

// const _dialectsSupported = ['postgres', 'mysql'];

class Metalize {
  constructor(options) {
    if (typeof options === 'string') {
      this.options = { dialect: options };
    } else {
      this.options = options;
    }

    this.dialect = this._getDialect();
  }

  _getDialect() {
    switch (this.options.dialect) {
      case 'postgres':
        return require('./dialects/postgres');
      case 'mysql':
        return require('./dialects/mysql');
      default: {
        throw new Error(`Dialect '${this.options.dialect}' is not supported`);
      }
    }
  }

  async find(objects, options = {}) {
    let result;
    let error;

    const client = await this.dialect.connection.getClient({
      client: options.client,
      connectionConfig: this.options.connectionConfig,
    });

    try {
      result = await Promise.all(
        ['tables', 'sequences'].map((catalog) => {
          const names = objects[catalog];
          if (names && names.length) {
            return this.dialect[catalog].find(client, names);
          } else {
            return new Map();
          }
        })
      );
    } catch (e) {
      error = e;
    }

    await client.end();

    if (error) throw error;

    return new Result({ tables: result[0], sequences: result[1] });
  }
}

module.exports = Metalize;
