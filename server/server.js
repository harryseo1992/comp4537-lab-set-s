const express = require('express');
const app = express();

app.listen(8080, function(err) {
  if(err) console.log(err);
})

app.get('/', function (req, res) {
  res.send('GET request to homepage')
})

app.get('/contact', function (req, res) {
  res.send('Hey there, stranger! Here is my <a href="mailto:harryseo92@gmail.com"> email </a>.')
})

app.use(express.static('./public'));
