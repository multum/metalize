/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

class BaseSequenceReader {
  static async read(metalize) {
    throw new Error(
      `Reading a sequence for the '${metalize._options.dialect}' dialect is not supported`
    );
  }
}

module.exports = BaseSequenceReader;
