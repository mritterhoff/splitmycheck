const db = require('./models/database.js');


// // client.connect()
// //   .then(() => console.log('connected to database'))
// //   .catch(e => console.error('database connection error', err.stack));


// db.query(
//   'INSERT INTO Links(link_code, state) values($1, $2)',
//   ['1BCdE', 'FAKE INFO 2'], 
//   (err, res) => {
//     console.log(err ? err.stack : res);
// })

const { DBActions } = require('./DBActions.js');

// const dbActions = new DBActions();



// dbActions.addRow(
//   {link_code: 'test1', state: 'thisisallfake'},
//   (obj) => {
//     // return the link
//     console.log(obj);
//   }); 

db.query('SELECT * FROM Links', [], (err, res) => {
  if (err) {
    return next(err);
  }
  for (let row of res.rows) {
    console.log(JSON.stringify(row, null, 2));  
  }
});
