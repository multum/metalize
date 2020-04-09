/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const addQuotes = (s) => `"${s}"`;
exports.addQuotes = addQuotes;

const removeQuotes = (s) => s.replace(/"/g, '');
exports.removeQuotes = removeQuotes;

exports.quoteObjectName = (target) =>
  target.split('.').map(addQuotes).join('.');

exports.separateName = (name) => {
  const chunks = name.split('.');
  return [chunks[1] ? chunks[0] : undefined, chunks[1] || chunks[0]];
};

exports.normalizeName = (target) => {
  const [schema = 'public', name] = exports.separateName(target);
  return `${removeQuotes(schema)}.${removeQuotes(name)}`;
};

exports.anyNamesSQL = (names) => {
  names = names.map((t) => `'${t}'`);
  return `any(array[${names.join(', ')}])`;
};
