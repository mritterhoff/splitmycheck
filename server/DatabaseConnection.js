const { Pool } = require('pg');
require('dotenv').config();

class Database {
  constructor() {
    this.pool = new Pool({
      // connectionString: 'postgres://localhost:5432/splitmycheck',
      connectionString: process.env.DATABASE_URL,
      ssl: true
    });
  }

  // lovingly taken from https://node-postgres.com/guides/project-structure
  query(text, params, callback) {
    const start = Date.now();

    return this.pool.query(text, params, (err, dbRes) => {
      console.log('Executed query:', {
        queryText: text,
        params,
        itTook: Date.now() - start,
        rows: dbRes ? dbRes.rowCount : 'UH-OH!'
      });
      callback(err, dbRes);
    });
  }
}

module.exports = Database;
