/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

class Sequences {
  static async find() {
    throw new Error(
      `Reading a sequence for the 'mysql' dialect is not supported`
    );
  }
}

module.exports = Sequences;
