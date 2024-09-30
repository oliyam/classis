//custom color logger
const log = require('./logger/color-logger.js').log;


const express = require('express');
var game = require('./model.js').run();

const app = express();

const port = 3000;

app.use(express.static('./bin/public'));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Access the parse results as request.body
app.post('/', function(req) {
  console.log(req.body);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname+"/bin/res/index.html")
})

app.get('/battle', (req, res) => {
  res.send(JSON.stringify(game))
})

app.listen(port, () => {
  log("==========================")
  log("==========================")
  log("CLASSIS-server is running:", 'yellow')
  log("PORT:"+port, 'cyan')
  log("==========================")
  log("ACTIVITY:", 'orange')
})