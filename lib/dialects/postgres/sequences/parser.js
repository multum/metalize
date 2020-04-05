/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

exports.properties = (attributes) => {
  const {
    start_value,
    minimum_value,
    maximum_value,
    cycle_option,
    increment,
    sequence,
  } = attributes;
  return {
    name: sequence,
    start: start_value,
    min: minimum_value,
    max: maximum_value,
    increment,
    cycle: cycle_option === 'YES',
  };
};
