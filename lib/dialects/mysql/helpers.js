/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const utils = require('../../utils');

exports.inArrayOfNamesSQL = (names) => {
  return `in (${names.map((n) => `'${n}'`).join(', ')})`;
};

exports.normalizeQueryResult = ([rows]) => {
  return Array.isArray(rows)
    ? rows.map(utils.lowercaseKeys)
    : utils.lowercaseKeys(rows);
};
