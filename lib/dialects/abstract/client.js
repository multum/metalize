/**
 * Copyright (c) 2019-present Andrey Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

class AbstractClient {
  _loadDialectModule(name) {
    try {
      return require(name);
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        throw new Error(`Please install ${name} package manually`);
      }
      throw err;
    }
  }

  _connect() {}

  _end() {}
}

module.exports = AbstractClient;
