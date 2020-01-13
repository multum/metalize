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

declare type Dialect = 'postgres' | 'mysql'

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

interface SequenceMetadata {
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

interface TableMetadata {
  columns: Array<Column>,
  primaryKey: Index,
  unique: Array<Index>,
  indexes: Array<Index>,
  foreignKeys: Array<ForeignKey>,
  checks: Array<Check>
}

interface ReadOptions {
  tables?: Array<string>,
  sequences?: Array<string>,
}

interface ReadResult {
  tables: Map<string, TableMetadata | undefined>,
  sequences: Map<string, SequenceMetadata | undefined>,
}

declare class Metalize {
  constructor(options: MetalizeOptions);

  read(ReadOptions): Promise<ReadResult>;

  endConnection(): Promise<null>
}

export = Metalize;
