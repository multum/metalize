/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const parser = require('./parser');
const QueryGenerator = require('./query-generator');
const utils = require('../../../utils');
const BaseSequenceReader = require('../../base/sequence');

class SequenceReader extends BaseSequenceReader {
  static getProperties(metalize, names) {
    return metalize._client
      .query(QueryGenerator.getSequence(names))
      .then(utils.get('rows'))
      .then(sequences =>
        sequences.reduce((acc, properties) => {
          acc[properties.sequence] = properties;
          return acc;
        }, {})
      )
      .then(utils.map(parser.sequence));
  }

  static async read(metalize, names) {
    const result = await SequenceReader.getProperties(metalize, names);
    return new Map(names.map(name => [name, result[name]]));
  }
}

module.exports = SequenceReader;
