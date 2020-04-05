/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const Result = require('./result');

/**
 *
 * @param {object} options
 * @param {object} [options.client]
 * @param {object} [options.connectionConfig]
 * @param {string} options.dialect
 */

// const _dialectsSupported = ['postgres', 'mysql'];

class Metalize {
  constructor(options) {
    this.options = options;

    const Dialect = this._getDialect();
    this.dialect = new Dialect(this);
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

  async find({ tables = [], sequences = [] }, options = {}) {
    let result;
    let error;

    const client = await this.dialect.connection.getClient(options);
    try {
      result = await Promise.all([
        tables.length ? this.dialect.tables.find(client, tables) : new Map(),
        sequences.length
          ? this.dialect.sequences.find(client, sequences)
          : new Map(),
      ]);
    } catch (e) {
      error = e;
    }

    await client.end();

    if (error) throw error;

    return new Result({ tables: result[0], sequences: result[1] });
  }
}

module.exports = Metalize;
