/**
 * Copyright (c) 2019-present Andrew Vereshchak
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

exports.cleanableGroup = _curry((key, array) => {
  return exports.groupBy(object => {
    const value = object[key];
    delete object[key];
    return value;
  }, array);
});

exports.group = _curry((key, array) => {
  return exports.groupBy(exports.get(key), array);
});

exports.map = _curry((resolver, object) => {
  return Array.isArray(object)
    ? object.map(resolver)
    : Object.entries(object).reduce((acc, [key, value]) => {
        acc[key] = resolver(value);
        return acc;
      }, {});
});

exports.sortBy = _curry((getter, array) => {
  return array.sort((a, b) => {
    a = getter(a);
    b = getter(b);
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  });
});

exports.exists = target => {
  return typeof target !== 'undefined' && target !== null;
};

exports.lowercaseKeys = object => {
  const result = {};
  for (const [key, value] of Object.entries(object)) {
    result[key.toLowerCase()] = value;
  }
  return result;
};

exports.pipe = (...functions) => {
  return data => functions.reduce((acc, func) => func(acc), data);
};

exports.curry = _curry;

exports.curryN = _curryN;
