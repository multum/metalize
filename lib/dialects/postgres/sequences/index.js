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

class Sequences {
  static getProperties(client, names) {
    return client
      .query(QueryGenerator.getSequence(names))
      .then(utils.get(['rows']))
      .then((sequences) => {
        return sequences.reduce((acc, properties) => {
          acc[properties.sequence] = properties;
          return acc;
        }, {});
      })
      .then(utils.map(parser.properties));
  }

  static async find(client, names) {
    const result = await Sequences.getProperties(client, names);
    return new Map(names.map((name) => [name, result[name]]));
  }
}

module.exports = Sequences;
