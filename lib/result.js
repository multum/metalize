/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

class Result {
  constructor({ sequences, tables }) {
    this.sequences = sequences;
    this.tables = tables;
  }
}

module.exports = Result;
