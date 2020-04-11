<br/>
<br/>

<p align='center'>
  <img src='https://multum.github.io/metalize/logo.svg' alt='metalize' width='500px'>
</p>
<p align='center'>Node.js tool for easy work with <strong>database metadata</strong></p>

<p align='center'>
  <img src='https://img.shields.io/travis/com/multum/metalize.svg?style=flat-square' alt=''>
  <a href='https://github.com/multum/metalize/blob/master/LICENSE'><img src='https://img.shields.io/npm/l/metalize.svg?style=flat-square' alt=''></a>
  <a href='https://www.npmjs.com/package/metalize'><img src='https://img.shields.io/npm/v/metalize.svg?style=flat-square' alt=''></a>
  <img src='https://img.shields.io/codecov/c/github/multum/metalize.svg?style=flat-square' alt=''>
</p>

<br/>

## Features

- **PostgreSQL** and **MySQL** dialects
- Reading **tables** (columns, identity columns, indexes, primary keys, unique, foreign keys, checks)
- Reading **sequences** (start, max, min, cycle, increment)

## Documentation

- [Documentation](https://multum.github.io/metalize/#/)
- [Contributing](https://github.com/multum/metalize/blob/master/CONTRIBUTING.md)

## Getting started with MySQL

#### Requires:

- **[Node.js](https://nodejs.org)** **v8.10** or more
- **[MySQL server](https://dev.mysql.com/downloads/mysql/)** **v5.6** or more
- **[node-mysql2](https://github.com/sidorares/node-mysql2)**

```bash
npm install metalize mysql2
```

```javascript
const Metalize = require('metalize');

const metalize = new Metalize({
  dialect: 'mysql',
  connectionConfig: {
    host: '127.0.0.1',
    user: 'root',
    database: 'public',
    port: 3306,
  },
});

metalize
  .find({ tables: ['public.users', 'public.events'] })
  .then((result) => console.log(result));

/**
Result {
  'tables': Map {
    'public.users' => {
        columns: [ ... ],
        primaryKey: { ... },
        foreignKeys: [ ... ],
        unique: [ ... ],
        indexes: [ ... ]
    },
    'public.events' => { ... }
  }
  'sequences': Map {}
}
*/
```

## Getting started with PostgreSQL

#### Requires:

- **[Node.js](https://nodejs.org)** **v8.10** or more
- **[PostgreSQL server](https://www.postgresql.org/download)** **v9.5** or more
- **[node-postgres](https://github.com/brianc/node-postgres)** **v7** or more

> **Do not use quotes** in the name of the object. `metalize` automatically adds them when needed

```bash
npm install metalize pg
```

```javascript
const Metalize = require('metalize');

const metalize = new Metalize({
  dialect: 'postgres',
  connectionConfig: {
    host: '127.0.0.1',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
  },
});

metalize
  .find({ tables: ['public.users', 'public.events'] })
  .then((result) => console.log(result));

/**
Result {
  'tables': Map {
    'public.users' => {
        columns: [ ... ],
        primaryKey: { ... },
        foreignKeys: [ ... ],
        unique: [ ... ],
        indexes: [ ... ],
        checks: [ ... ]
    },
    'public.events' => { ... }
  }
  'sequences': Map {}
}
*/

metalize
  .find({ sequences: ['public.usersSeq'] })
  .then((result) => console.log(result));

/**
Result {
  'tables': Map {}
  'sequences': Map {
    'public.usersSeq' => {
      start: '1',
      min: '1',
      max: '9999',
      increment: '1',
      cycle: true,
    }
  }
}
*/
```

## Using an existing connection

```javascript
const Metalize = require('metalize');
const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'postgres',
});

client.connect();

/**
 * or using 'mysql' dialect
 * @example
 * const { createConnection } = require('mysql2/promise');
 * const client = await createConnection(...)
 */

const metalize = new Metalize({ dialect: 'postgres' });

metalize
  .find({ tables: ['public.users'] }, { client })
  .then((result) => console.log(result));

/**
 * A new connection will not be opened
 * Instead, the connection from the 'options' will be used
 */
```

## License

**metalize** is open source software [licensed as MIT](https://github.com/multum/metalize/blob/master/LICENSE).
