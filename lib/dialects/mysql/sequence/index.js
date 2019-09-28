/**
 * Copyright (c) 2019-present Andrey Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const AbstractSequenceReader = require('../../abstract/sequence');

class SequenceReader extends AbstractSequenceReader {
  constructor(metalize, options) {
    super(metalize);
    this.options = options;
  }
}

module.exports = SequenceReader;
