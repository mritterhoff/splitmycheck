/* eslint-disable camelcase */

const Database = require('./models/Database');

class DBActions {
  // TODO how do we make sure this query happens before any future ones?
  constructor() {
    this.db = new Database();
    const createTable =
      `CREATE TABLE IF NOT EXISTS Links (
          link_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
          link_code char(6),
          state text NOT NULL,
          date_created timestamp not null default CURRENT_TIMESTAMP
        )`;

    this.db.query(createTable, [], (err, res) => {
      console.log(err ? err.stack : res);
    });
  }

  addRow(obj, cb) {
    this.db.query(
      'INSERT INTO Links (link_code, state) VALUES ($1, $2)',
      [ obj.link_code, obj.state ],
      (err) => {
        cb(obj, err);
      }
    );
  }

  findByLinkCode(link_code, cb) {
    this.db.query(
      `SELECT * FROM Links WHERE link_code = '${link_code}'`,
      [],
      (err, dbRes) => {
        cb(dbRes, err);
      }
    );
  }
}

module.exports = DBActions;
