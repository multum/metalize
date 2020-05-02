/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const utils = require('../../../utils');
const CommonTables = require('../../common/tables');
const QueryGenerator = require('./query-generator');
const parser = require('./parser');
const helpers = require('../helpers');

class Tables {
  getExistingTables(client, names) {
    return client
      .query(QueryGenerator.getExistingTables(names))
      .then(helpers.normalizeQueryResult)
      .then(utils.map(utils.get(['name'])));
  }

  getColumns(client, names) {
    return client
      .query(QueryGenerator.getColumns(names))
      .then(helpers.normalizeQueryResult)
      .then(utils.group('table'))
      .then(utils.map(parser.columns));
  }

  getConstraints(client, names) {
    return client
      .query(QueryGenerator.getConstraints(names))
      .then(helpers.normalizeQueryResult)
      .then(utils.group('table'))
      .then(utils.map(parser.constraints));
  }

  getIndexes(client, names) {
    return client
      .query(QueryGenerator.getIndexes(names))
      .then(helpers.normalizeQueryResult)
      .then(utils.group('table'))
      .then(utils.map(parser.indexes));
  }

  find() {
    return CommonTables.find.apply(this, arguments);
  }
}

module.exports = new Tables();
