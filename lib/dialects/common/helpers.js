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

exports.moveConstraintToGroup = (groups, { type, ...constraint }) => {
  const groupNames = {
    foreignKey: 'foreignKeys',
    unique: 'unique',
    check: 'checks',
  };

  if (type === 'primaryKey') {
    groups.primaryKey = constraint;
  } else {
    const currentGroup = groupNames[type];
    if (groups[currentGroup]) {
      groups[currentGroup].push(constraint);
    }
  }

  return groups;
};
