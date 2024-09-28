const express = require('express');
const app = express();

app.use(express.static('bin'));

app.get('/', (req, res) => {
  res.sendFile(__dirname+"/bin/res/index.html")
})

app.listen(3000, () => {
  console.log("Server is Running")
})