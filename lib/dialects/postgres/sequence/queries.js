/**
 * Copyright (c) 2019-present Andrey Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const helpers = require('../../../helpers');

exports.getSequence = tables => `
select
  start_value,
  minimum_value,
  maximum_value,
  increment,
  cycle_option,
  sequence_schema || '.' || sequence_name as sequence
from information_schema.sequences
where sequence_schema || '.' || sequence_name = ${helpers.sqlAnyName(tables)};
`;
