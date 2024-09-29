const express = require('express');
const app = express();

const port = 3000;

app.use(express.static('bin'));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Access the parse results as request.body
app.post('/', function(req) {
  console.log('x')
  console.log(req.body);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname+"/bin/res/index.html")
})

app.listen(port, () => {
  console.log("==================")
  console.log("==================")
  console.log("CLASSIS-server is running:")
  console.log("PORT:"+port)
})