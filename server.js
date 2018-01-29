const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const fs = require('fs');

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

require('dotenv').config()
const PORT = process.env.PORT || 3001;
console.log(`setting app port to ${PORT}`);
app.set("port", PORT);

// enable logging
// more options: https://github.com/expressjs/morgan
//app.use(morgan('combined'))
app.use(morgan('tiny'));

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  console.log('production environment, serving client/build files...');

  app.use((req,res,next) => {
    if (req.method === 'GET' && req.url === '/') {
      var html = fs.readFileSync(__dirname + '/client/build/' + 'index.html', 'utf8');
      var $ = cheerio.load(html);
      var scriptNode = '<script>alert("script appended!");</script>';
      $('body').append(scriptNode);
      res.send($.html());
    }
    else { 
      next();
    }
  });

  app.use(express.static("client/build"));
}

app.post("/save", (req, res) => {
  console.log(`POST to /save: ${JSON.stringify(req.body.state)}`);
  res.json({'savedURL': 'www.splitmycheck.com/saved/fakeURL'})
});

app.get("/saved/*", (req, res) => {
  console.log(`accessing /saved state: ${JSON.stringify(req.body.state)}`);
  res.json({'savedState': JSON.stringify({'examplestate' : 'example!!'})});
});


app.get("/api/", (req, res) => {
  const param = req.query.q;

  if (!param) {
    res.json({
      error: "Missing required parameter `q`"
    });
    return;
  }
  res.json({'yourQParamWas': param})
});



app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
