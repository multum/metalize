/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const Tables = require('./tables');
const Sequences = require('./sequences');
const ConnectionManager = require('./connection-manager');

/**
 *
 * @param {object} options
 * @param {object} options.metalize
 */

class MySqlDialect {
  constructor(metalize) {
    this.tables = Tables;
    this.sequences = Sequences;
    this.connection = new ConnectionManager(metalize);
  }
}

module.exports = MySqlDialect;
