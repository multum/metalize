/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

exports.getManuallyInstalledModule = (name) => {
  try {
    return require(name);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      throw new Error(`Please install '${name}' package manually`);
    }
    throw err;
  }
};

const constraintGroupNames = {
  primaryKey: 'primaryKeys',
  foreignKey: 'foreignKeys',
  unique: 'unique',
  check: 'checks',
};

exports.moveConstraintToGroup = (acc, type, constraint) => {
  const currentGroup = constraintGroupNames[type];
  acc[currentGroup] = acc[currentGroup] || [];
  acc[currentGroup].push(constraint);
  return acc;
};
