/**
 * Copyright (c) 2019-present Andrey Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const parser = require('./parser');
const queries = require('./queries');
const utils = require('../../../utils');
const helpers = require('../../../helpers');

class SequenceReader {
  constructor(metalize, options) {
    this.metalize = metalize;
    this.names = options.names.map(helpers.normalizeName);
  }

  getProperties() {
    return this.metalize._client
      .query(queries.getSequence(this.names))
      .then(utils.get('rows'))
      .then(sequences =>
        sequences.reduce((acc, properties) => {
          acc[properties.sequence] = properties;
          return acc;
        }, {})
      )
      .then(utils.mapObject(parser.sequence));
  }

  async read() {
    const result = await this.getProperties();
    return this.names.reduce((acc, name) => {
      acc[name] = result[name];
      return acc;
    }, {});
  }
}

module.exports = SequenceReader;
