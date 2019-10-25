/**
 * Copyright (c) 2019-present Andrey Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

exports.separateName = name => {
  const chunks = name.split('.');
  return [chunks[1] ? chunks[0] : undefined, chunks[1] || chunks[0]];
};

exports.normalizeName = target => {
  const [schema = 'public', name] = exports.separateName(target);
  return `${schema}.${name}`;
};

exports.sqlAnyName = (names, operator = '') => {
  names = names.map(t => `'${t}'${operator}`);
  return `any(array[${names.join(', ')}])`;
};

exports.lowercaseKeys = object => {
  const result = {};
  for (const [key, value] of Object.entries(object)) {
    result[key.toLowerCase()] = value;
  }
  return result;
};
