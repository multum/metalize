/**
 * Copyright (c) 2019-present Andrey Vereshchak
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

    this.read = {
      tables: names => this._read('tables', names),
      sequences: names => this._read('sequences', names),
    };
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

  _read(type, names) {
    const { Table, Sequence } = this._dialect;
    if (!names || names.length === 0) {
      throw new Error('At least one name must be passed');
    }
    switch (type) {
      case 'tables': {
        return new Table(this, { names }).read();
      }
      case 'sequences': {
        return new Sequence(this, { names }).read();
      }
    }
  }

  endConnection() {
    return this._client._end();
  }
}

module.exports = Metalize;
