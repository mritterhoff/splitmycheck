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
        rows: dbRes ? dbRes.rowCount : 'no rows...'
      });
      console.log(dbRes);
      callback(err, dbRes);
    });
  }

    // lovingly taken from https://node-postgres.com/guides/project-structure
  async queryAsync(text, params) {
    const start = Date.now();

    const res = await this.pool.query(text, params);
  
    console.log('Executed query:', {
      queryText: text,
      params: params || 'none',
      itTook: Date.now() - start,
      rows: res ? res.rowCount : 'no rows...'
    });
    return res;
  }
}

module.exports = Database;
