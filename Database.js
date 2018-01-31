const sqlite3 = require('sqlite3').verbose();

class Database {
  constructor() {
    this.db = new sqlite3.Database('splitmycheck.db', (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the local database.');
    });

    // TODO might want to wrap this with this.db.serialize()
    this.db.run(`
      CREATE TABLE IF NOT EXISTS Links (
        link_id text PRIMARY KEY,
        state text NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP
      );`);
  }

  addRow(obj, cb) {
    this.db.serialize(() => {
      // insert one row into the langs table
      this.db.run(`INSERT INTO Links(link_id, state) VALUES (?, ?)`, [ obj.link_id, obj.state ], (err) => {
        if (err) {
          return console.log(err.message);
        }
        cb(obj);
      });
    });
  }

  close() {
    this.db.close();
  }

  query(link_id, cb) {
    this.db.serialize(() => {
      const sql = `SELECT * FROM Links
                   WHERE link_id = '${link_id}'`;
   
      // get just returns the first row
      this.db.get(sql, [], (err, row) => {
        if (err) { throw err; }
        cb(row);
      });
    });
  }

  queryAll() {
    this.db.serialize(() => {
      const sql = `SELECT * FROM Links`;
   
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          console.log(row);
        });
      });
    });
  }

}

module.exports = { Database };

// let db = new Database();

// let rows = 10;
// while (rows-- > 0) {
//   db.addRow(
//     {'link_id': randomstring.generate(6), 'state': `state${rows}`},
//     (obj) => {console.log(`the state is... ${JSON.stringify(obj)}`)});  
// }


// db.queryAll();
// // db.query('ABCDEF', (row) => {console.log(`the state is... ${JSON.stringify(row)}`)});
// db.close();


// const { Client } = require('pg');
// require('dotenv').config()

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: true
// });

// client.connect();

// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });