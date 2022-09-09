const express = require('express');
const app = express();
const https = require('https');

app.listen(8080, function(err) {
  if(err) console.log(err);
})

var apikey = "b660f3402c54cb9a9c48f89c35249e5c";

app.get("/", function(req, res) {
  var cityName = 'Vancouver';
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=" + apikey;

  https.get(url, function(https_res) {
    https_res.on("data", function(data) {
      res.write("<h1> " + cityName + " weather is " + JSON.parse(data).weather[0].description + "</h1>");
      res.write("<h1> " + cityName + " temp is " + JSON.parse(data).main.temp + "</h1>");
      res.write('  <img src="' + "http://openweathermap.org/img/wn/" + JSON.parse(data).weather[0].icon + '.png"' + "/>");
      res.send();
    })
  })
})

app.get('/contact', function (req, res) {
  res.send('Hey there, stranger! Here is my <a href="mailto:harryseo92@gmail.com"> email </a>.')
})

app.use(express.static('./public'));
