/**
 * Copyright (c) 2019-present Andrey Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

interface MetalizeOptions {
  dialect: Dialect,
  connectionConfig?: Object,
  client?: any
}

interface Reference {
  table: string,
  columns: Array<string>,
}

declare type Dialect = 'postgres'

declare type ActionType = 'CASCADE' | 'RESTRICT' | 'NO ACTION'

declare type MatchType = 'FULL' | 'PARTIAL' | 'SIMPLE'

declare type ColumnValueType = string | number

interface ForeignKey {
  name: String
  columns: Array<string>
  match: MatchType,
  onDelete: ActionType,
  onUpdate: ActionType,
  references: Reference
}

interface Column {
  name: string,
  type: string,
  nullable: boolean,
  default: ColumnValueType
}

interface Index {
  name: String,
  columns: Array<string>,
}

interface SequenceSchema {
  name: string,
  start: string,
  min: string,
  max: string,
  increment: string,
  cycle: boolean,
}

interface Check {
  name: String,
  condition: string
}

interface TableSchema {
  columns: Array<Column>,
  primaryKey: Index,
  unique: Array<Index>,
  indexes: Array<Index>,
  foreignKeys: Array<ForeignKey>,
  checks: Array<Check>
}

declare class Metalize {
  constructor(options: MetalizeOptions);

  read: {
    tables(names: String[]): Promise<TableSchema>
    sequences(names: String[]): Promise<SequenceSchema>
  };

  endConnection(): Promise<null>
}

export = Metalize;
