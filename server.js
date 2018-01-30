const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const fs = require('fs');

const { Database } = require('./Database.js');
const randomstring = require("randomstring");

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.text({ type: 'text/plain' }))  // parse a plain body into a string

require('dotenv').config()
const PORT = process.env.PORT || 3001;
console.log(`setting app port to ${PORT}`);
app.set("port", PORT);

let db = new Database();

// enable logging
// more options: https://github.com/expressjs/morgan
//app.use(morgan('combined'))
app.use(morgan('tiny'));

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  console.log('production environment, serving client/build files...');

  // app.use((req,res,next) => {
  //   if (req.method === 'GET' && req.url === '/') {
  //     var html = fs.readFileSync(__dirname + '/client/build/' + 'index.html', 'utf8');
  //     var $ = cheerio.load(html);
  //     var scriptNode = '<script>alert("script appended!");</script>';
  //     $('body').append(scriptNode);
  //     res.send($.html());
  //   }
  //   else { 
  //     next();
  //   }
  // });

  app.use(express.static("client/build"));
}

app.post("/save", (req, res) => {
  let stateString = req.body;
  console.log(`POST to /save: ${stateString}`);
  validateStateString(stateString);

  // captures 'localhost:port' for testing ease
  let host = req.headers.host;

  db.addRow(
    {'link_id': randomstring.generate(6), 'state': stateString},
    (obj) => {
      console.log(`saved new state, with link_id: ${obj.link_id}`);

      // return 
      res.send(`${host}/saved/${obj.link_id}`);
    });  
  
});

app.get("/saved/*", (req, res) => {
  let key = req.params[0];
  console.log(`GET to /saved: ${key}`);
  validateLinkID(key);

  db.query(key, (row) => {
    res.send(row.state);
  });
  console.log('did this happen?');
});


// app.get("/api/", (req, res) => {
//   const param = req.query.q;

//   if (!param) {
//     res.json({
//       error: "Missing required parameter `q`"
//     });
//     return;
//   }
//   res.json({'yourQParamWas': param})
// });


// 6 alphanumeric chars = (10+26+26)^6 = 62^6 = 56.8 billion combinations



app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});

// quick and dirty validation of stateString
function validateStateString(stateString) {
  let valid = false;
  if (typeof stateString === 'string') {
    valid = ['people', 'dishes', 'orders', 'tax', 'tip']
      .map(str => stateString.indexOf(str) > -1)
      .reduce((a,b)=>(a && b), true);
  }
  if (!valid) {
    throw new Error(`stateString is invalid: ${stateString}`);
  }
}

// quick and dirty validation of linkID
function validateLinkID(linkID) {
  let valid = false;
  let alphanumeric = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (linkID.length === 6) {
    valid = linkID.split('')
      .map(l => v.indexOf(l) > -1)
      .reduce((a,b)=>(a && b), true);
  }
  if (!valid) {
    throw new Error(`linkID is invalid: ${linkID}`);
  }
}
