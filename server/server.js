/* eslint-disable camelcase */

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const fs = require('fs');

const DBActions = require('./DBActionsReorg');
const validators = require('./columnValidators');

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.text({ type: 'text/plain' }));// parse a plain body into a string

require('dotenv').config();

const PORT = process.env.PORT || 3001;
console.log(`setting app port to ${PORT}`);
app.set('port', PORT);

const dbActions = new DBActions();

// enable logging
// more options: https://github.com/expressjs/morgan
// app.use(morgan('combined'))
app.use(morgan('tiny'));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  console.log('production environment, serving client/build files...');
  app.use(express.static('client/build'));
}

app.post('/save', (req, res) => {
  const stateObj = JSON.parse(req.body);
  if (typeof stateObj !== 'object') { 
    throw new Error('expecting object, not string'); 
  }
  // TODO make this validate the json obj, not the string
  //validators.validateStateString(req.body);

  dbActions.makeNewSplitPromise(stateObj)
    .then((link_code) => {
      // capture 'localhost:port' for testing ease
      const { host } = req.headers;
      res.send(`${host}/saved/${link_code}`);
    });
});

app.get('/saved/*', (req, res) => {
  const key = req.params[0];
  console.log(`GET to /saved: ${key}`);
  validators.validateLinkID(key);

  // TODO possibly add a message saying that link has loaded successfully?
  // TODO we should return the webpage with an error message instead
  dbActions.assembleObjFromLinkCodePromise(key)
    .then((ressurectedObj) => {
      if (ressurectedObj) {
        const html = fs.readFileSync(`${__dirname}/../client/build/index.html`, 'utf8');
        const $ = cheerio.load(html);
        $('head')
          .prepend(`<script>window.SERVER_DATA=${JSON.stringify(ressurectedObj)};</script>`);
        res.send($.html());
      }
      else {
        res.status(404).send('Couldn\'t find that saved link :(');
      }
    });
});

app.use((req, res) => {
  res.status(404).send("404: Can't find what you're looking for.");
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});

// Short term solution to prevent unanticipated errors from crashing the whole app
// more info: https://stackoverflow.com/q/5999373/1188090
// TODO do something more elegant
process.on('uncaughtException', (err) => {
  console.error(err);
  console.log('Node NOT Exiting...');
});
