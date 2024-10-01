//custom color logger
const log = require('./logger/color-logger.js').log;


const express = require('express');
const classis = require('./server-model.js').run();
var game = classis;

const app = express();

const port = 3000;

app.use(express.static('./bin/public'));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.json());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Access the parse results as request.body
app.post('/', function(req) {
  console.log(req.body);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname+"/bin/res/index.html")
})

app.get('/battle_rx', (req, res) => {
  log("[> TX: sending game-update. <]",'yellow')
  res.send(JSON.stringify(game))
})

app.post('/battle_tx', (req, res) => {
  log("[> RX: recieved game-update. <]",'yellow')
  game=Object.assign(game, req.body)
  res.send()
})

app.listen(port, () => {
  log("==========================")
  log("==========================")
  log("CLASSIS-server is running:", 'yellow')
  log("PORT:"+port, 'cyan')
  log("==========================")
  log("ACTIVITY:", 'orange')
})