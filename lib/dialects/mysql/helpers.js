/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

exports.inArrayOfNamesSQL = names =>
  `in (${names.map(n => `'${n}'`).join(', ')})`;
