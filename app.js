const express = require('express');
const app = express();

const port = 3000;

app.use(express.static('bin'));

app.get('/', (req, res) => {
  res.sendFile(__dirname+"/bin/res/index.html")
})

app.listen(port, () => {
  console.log("==================")
  console.log("==================")
  console.log("CLASSIS-server is running:")
  console.log("PORT:"+port)
})