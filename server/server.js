const express = require('express');
const app = express();

app.listen(8080, function(err) {
  if(err) console.log(err);
})

app.get('/', function (req, res) {
  res.send('GET request to homepage')
})