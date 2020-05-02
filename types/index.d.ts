/**
 * Copyright (c) 2019-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare type Dialect = 'postgres' | 'mysql';

interface MetalizeOptions {
  dialect: Dialect;
  connectionConfig?: object;
}

interface Reference {
  table: string;
  columns: string[];
}

declare type ActionType =
  | 'NO ACTION'
  | 'RESTRICT'
  | 'CASCADE'
  | 'SET NULL'
  | 'SET DEFAULT';

interface ForeignKey {
  name: string;
  columns: string[];
  match: 'SIMPLE' | 'PARTIAL' | 'FULL';
  onDelete: ActionType;
  onUpdate: ActionType;
  references: Reference;
}

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  default: string;
  identity?: Identity;
}

interface Index {
  name: string;
  columns: string[];
}

interface SequenceAttributes {
  start: string;
  min: string;
  max: string;
  increment: string;
  cycle: boolean;
}

interface Identity extends SequenceAttributes {
  generation: 'ALWAYS' | 'BY DEFAULT';
}

interface Sequence extends SequenceAttributes {
  name: string;
}

interface Check {
  name: string;
  condition: string;
}

interface Table {
  name: string;
  columns: Column[];
  primaryKey: Index;
  unique: Index[];
  indexes: Index[];
  foreignKeys: ForeignKey[];
  checks: Check[];
}

interface FindObjects {
  tables?: string[];
  sequences?: string[];
}

interface FindOptions {
  client?: object;
}

interface Result {
  // @ts-ignore
  tables: Map<string, Table | undefined>;
  // @ts-ignore
  sequences: Map<string, Sequence | undefined>;
}

declare class Metalize {
  constructor(options: MetalizeOptions);

  /**
   * @example
   * // using an automatically created connection
   * await metalize.find({
   *   tables: [ 'public.users' ],
   *   sequences: [ 'public.users_seq' ]
   * });
   *
   * // using an existent connection
   * await metalize.find({
   *   tables: [ 'public.users' ]);
   * }, { client });
   */
  find(objects: FindObjects, options?: FindOptions): Promise<Result>;
}

export = Metalize;
