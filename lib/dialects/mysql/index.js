/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const tables = require('./tables');
const sequences = require('./sequences');
const connection = require('./connection-manager');

class Dialect {
  constructor() {
    this.tables = tables;
    this.sequences = sequences;
    this.connection = connection;
  }
}

module.exports = new Dialect();
