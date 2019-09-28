/**
 * Copyright (c) 2019-present Andrey Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const Client = require('./client');
const Table = require('./tables');
const Sequence = require('./sequence');

/**
 *
 * @param {object} options
 * @param {object} options.metalize
 */

class MySqlDialect {
  constructor() {
    this.Client = Client;
    this.Table = Table;
    this.Sequence = Sequence;
  }
}

module.exports = MySqlDialect;
