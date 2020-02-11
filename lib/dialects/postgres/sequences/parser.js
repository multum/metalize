/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

exports.sequence = sequence => {
  const {
    start_value: start,
    minimum_value: min,
    maximum_value: max,
    cycle_option: cycle,
    increment,
  } = sequence;
  return { start, min, max, increment, cycle: cycle === 'YES' };
};
