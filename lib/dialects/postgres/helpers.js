/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const _removeQuotes = s => {
  return s.replace(/"/g, '');
};

const _addQuotes = s => {
  return `"${s}"`;
};

exports.removeQuotes = _removeQuotes;
exports.addQuotes = _addQuotes;

exports.quoteName = target =>
  target
    .split('.')
    .map(_addQuotes)
    .join('.');

exports.separateName = name => {
  const chunks = name.split('.');
  return [chunks[1] ? chunks[0] : undefined, chunks[1] || chunks[0]];
};

exports.normalizeName = target => {
  const [schema = 'public', name] = exports.separateName(target);
  return `${_removeQuotes(schema)}.${_removeQuotes(name)}`;
};

exports.anyNamesSQL = names => {
  names = names.map(t => `'${t}'`);
  return `any(array[${names.join(', ')}])`;
};
