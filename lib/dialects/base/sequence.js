/**
 * Copyright (c) 2019-present Andrey Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

class BaseSequenceReader {
  static async read(metalize) {
    throw new Error(
      `read({ sequences: [...] }) method for the \`${metalize.dialect}\` dialect is not supported`
    );
  }
}

module.exports = BaseSequenceReader;
