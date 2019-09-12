/**
 * Copyright (c) 2019-present Andrey Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const _curryN = (n, fn) => (...args) =>
  args.length >= n
    ? fn(...args)
    : _curryN(n - args.length, (...innerArgs) => fn(...args, ...innerArgs));

const _curry = fn => {
  return _curryN(fn.length, fn);
};

exports.get = _curry((path, obj) => {
  if (typeof path === 'string') {
    path = path
      .replace(/.?\[/g, match => (match === '[' ? '' : '.'))
      .replace(/]/g, '')
      .split('.');
  }

  for (const level of path) {
    obj = obj[level];
    if (obj === undefined) {
      break;
    }
  }

  return obj;
});

exports.groupBy = _curry((getter, array) => {
  return array.reduce((acc, object) => {
    const key = getter(object);
    const array = acc[key] || [];
    array.push(object);
    acc[key] = array;
    return acc;
  }, {});
});

exports.mapObject = _curry((resolver, object) => {
  return Object.entries(object).reduce((acc, [key, value]) => {
    acc[key] = resolver(value);
    return acc;
  }, {});
});

exports.pipe = (...functions) => {
  return data => functions.reduce((acc, func) => func(acc), data);
};

exports.curry = _curry;

exports.curryN = _curryN;
