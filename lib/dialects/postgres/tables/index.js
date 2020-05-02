/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const QueryGenerator = require('./query-generator');
const CommonTables = require('../../common/tables');
const parser = require('./parser');
const utils = require('../../../utils');

class Tables {
  getExistingTables(client, names) {
    return client
      .query(QueryGenerator.getExistingTables(names))
      .then(utils.get(['rows']))
      .then(utils.map(utils.get(['name'])));
  }

  getColumns(client, names) {
    return client
      .query(QueryGenerator.getColumns(names))
      .then(utils.get(['rows']))
      .then(utils.group('table'))
      .then(utils.map(parser.columns));
  }

  getConstraints(client, names) {
    return client
      .query(QueryGenerator.getConstraints(names))
      .then(utils.get(['rows']))
      .then(utils.group('table'))
      .then(utils.map(parser.constraints));
  }

  getIndexes(client, names) {
    return client
      .query(QueryGenerator.getIndexes(names))
      .then(utils.get(['rows']))
      .then(utils.group('table'))
      .then(utils.map(parser.indexes));
  }

  find() {
    return CommonTables.find.apply(this, arguments);
  }
}

module.exports = new Tables();
