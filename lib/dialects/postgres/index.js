/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const TableInterface = require('./tables');
const SequenceInterface = require('./sequences');
const ConnectionManager = require('./connection-manager');

/**
 *
 * @param {object} options
 * @param {object} options.metalize
 */

class PostgresDialect {
  constructor() {
    this.TableInterface = TableInterface;
    this.SequenceInterface = SequenceInterface;
    this.ConnectionManager = ConnectionManager;
  }
}

module.exports = PostgresDialect;
