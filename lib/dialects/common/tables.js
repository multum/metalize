/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const utils = require('../../utils');

async function find(client, names) {
  const existing = await this.filterByExisting(client, names);
  if (existing.length === 0) {
    return new Map(names.map((name) => [name, undefined]));
  }

  const [columns, constraints, indexes] = await Promise.all([
    this.getColumns(client, existing),
    this.getConstraints(client, existing),
    this.getIndexes(client, existing),
  ]);

  return names.reduce((acc, name) => {
    let structure;
    if (existing.includes(name)) {
      const _constraints = constraints[name] || {};
      structure = {
        name,
        columns: columns[name],
        primaryKey: utils.get(['primaryKeys', 0], _constraints) || null,
        foreignKeys: _constraints.foreignKeys || [],
        unique: _constraints.unique || [],
        checks: _constraints.checks || [],
        indexes: indexes[name] || [],
      };
    }
    return acc.set(name, structure);
  }, new Map());
}

module.exports = { find };
