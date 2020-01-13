/**
 * Copyright (c) 2019-present Andrey Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const TableInterface = require('./tables');
const SequenceInterface = require('./sequences');
const ConnectionManager = require('./connectionManager');

/**
 *
 * @param {object} options
 * @param {object} options.metalize
 */

class MySqlDialect {
  constructor() {
    this.TableInterface = TableInterface;
    this.SequenceInterface = SequenceInterface;
    this.ConnectionManager = ConnectionManager;
  }
}

module.exports = MySqlDialect;
