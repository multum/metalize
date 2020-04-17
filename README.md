<br/>
<br/>

<p align='center'>
  <img src='https://multum.github.io/metalize/logo.svg' alt='metalize' width='500px'>
</p>
<p align='center'>Node.js tool for easy work with <strong>database metadata</strong></p>

<p align='center'>
  <img src='https://github.com/multum/metalize/workflows/Lint%20and%20test/badge.svg' alt=''/>
  <a href='https://github.com/multum/metalize/blob/master/LICENSE'><img src='https://img.shields.io/npm/l/metalize.svg?style=flat' alt=''></a>
  <a href='https://www.npmjs.com/package/metalize'><img src='https://img.shields.io/npm/v/metalize.svg?style=flat' alt=''></a>
  <img src='https://img.shields.io/codecov/c/github/multum/metalize.svg?style=flat' alt=''>
</p>

<br/>

## Features

- Fully tested
- Fully documented
- **PostgreSQL** and **MySQL** dialects
- [**Tables**](https://multum.github.io/metalize/#/metadata/table)
  - Detailed [column](https://multum.github.io/metalize/#/metadata/column) metadata
  - Multi-column constraints
  - [Indexes](https://multum.github.io/metalize/#/metadata/index)
- [**Sequences**](https://multum.github.io/metalize/#/metadata/sequence)

## Documentation

- [Documentation](https://multum.github.io/metalize/#/)
- [Contributing](https://github.com/multum/metalize/blob/master/CONTRIBUTING.md)

## Getting Started

```bash
npm install metalize pg       # postgres
npm install metalize mysql2   # mysql
```

> **Do not use quotes** in the name of the object. `Metalize` automatically adds them when needed

```javascript
const Metalize = require('metalize');

const metalize = new Metalize({
  dialect: 'postgres', // one of [ 'postgres', 'mysql' ]
  connectionConfig: {
    host: '127.0.0.1',
    port: 5432,
    // other connection options for dialect
  },
});

metalize
  .find({
    tables: ['public.users', 'public.events'],
    sequences: ['public.usersSeq'], // only for 'postgres' dialect
  })
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

**Metalize** is open source software [licensed as MIT](https://github.com/multum/metalize/blob/master/LICENSE).
