/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const QueryGenerator = require('./query-generator');
const parser = require('./parser');
const utils = require('../../../utils');

class Tables {
  static getColumns(client, names) {
    return client
      .query(QueryGenerator.getColumns(names))
      .then(utils.get(['rows']))
      .then(utils.group('table'))
      .then(utils.map(parser.columns));
  }

  static getConstraints(client, names) {
    return client
      .query(QueryGenerator.getConstraints(names))
      .then(utils.get([1, 'rows'])) // `1` is the result of executing sql-query to get constraints
      .then(utils.group('table'))
      .then(
        utils.map(utils.pipe(parser.constraints, utils.cleanableGroup('type')))
      );
  }

  static getIndexes(client, names) {
    return client
      .query(QueryGenerator.getIndexes(names))
      .then(utils.get(['rows']))
      .then(utils.group('table'))
      .then(utils.map(parser.indexes));
  }

  static async filterExisting(client, names) {
    const exists = await Promise.all(
      names.map((name) => {
        return client.query(QueryGenerator.tableExist(name));
      })
    );
    return names.filter((_, index) =>
      utils.get([index, 'rows', 0, 'exists'], exists)
    );
  }

  static async find(client, names) {
    const existing = await Tables.filterExisting(client, names);
    if (existing.length === 0) {
      return new Map(names.map((name) => [name, undefined]));
    }
    const [columns, constraints, indexes] = await Promise.all([
      Tables.getColumns(client, existing),
      Tables.getConstraints(client, existing),
      Tables.getIndexes(client, existing),
    ]);

    return names.reduce((acc, name) => {
      if (existing.includes(name)) {
        return acc.set(name, {
          name,
          columns: columns[name],
          primaryKey: utils.get([name, 'primaryKey', 0], constraints),
          foreignKeys: utils.get([name, 'foreignKey'], constraints) || [],
          unique: utils.get([name, 'unique'], constraints) || [],
          checks: utils.get([name, 'check'], constraints) || [],
          indexes: indexes[name] || [],
        });
      } else {
        return acc.set(name, undefined);
      }
    }, new Map());
  }
}

module.exports = Tables;
