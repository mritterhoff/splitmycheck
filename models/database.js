const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  // connectionString: 'postgres://localhost:5432/splitmycheck',
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

// lovingly taken from https://node-postgres.com/guides/project-structure
function query(text, params, callback) {
  const start = Date.now();

  return pool.query(text, params, (err, dbRes) => {
    const duration = Date.now() - start;
    console.log('executed query', {
      text, params, duration, rows: dbRes ? dbRes.rowCount : 'UH-OH!'
    });
    callback(err, dbRes);
  });
}

module.exports = {
  query
};
