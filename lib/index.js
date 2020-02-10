/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

/**
 *
 * @param {object} options
 * @param {object} [options.client]
 * @param {object} [options.connectionConfig]
 * @param {string} options.dialect
 */

const _dialectsSupported = ['postgres'];

class Metalize {
  constructor(options) {
    this._options = options;

    const Dialect = this._getDialect();
    this._dialect = new Dialect();

    this._client = new this._dialect.ConnectionManager(this);
  }

  _getDialect() {
    switch (this._options.dialect) {
      case 'postgres':
        return require('./dialects/postgres');
      case 'mysql':
        return require('./dialects/mysql');
      default: {
        const supportedDialects = _dialectsSupported.join(' | ');
        throw new Error(
          `Please use one of the following dialects: [ ${supportedDialects} ]`
        );
      }
    }
  }

  read({ tables = [], sequences = [] }) {
    return Promise.all([
      tables.length
        ? this._dialect.TableInterface.read(this, tables)
        : new Map(),
      sequences.length
        ? this._dialect.SequenceInterface.read(this, sequences)
        : new Map(),
    ]).then(([tables, sequences]) => ({ tables, sequences }));
  }

  endConnection() {
    return this._client._end();
  }
}

module.exports = Metalize;
