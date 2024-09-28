const app = require('express')();

app.use(express.static('bin'));

app.get('/', (req, res) => {
  res.sendFile(__dirname+"/bin/res/index.html")
})