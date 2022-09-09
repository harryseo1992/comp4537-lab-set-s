const express = require('express');
const app = express();
const https = require('https');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/test",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const citySchema = new mongoose.Schema({
  name: String,
  temperature: Number,
  description: String
});

const cityModel = mongoose.model("cities", citySchema);

app.use(bodyParser.json());

app.listen(8080, function(err) {
  if(err) console.log(err);
})

app.get('/cities/:city_name', function(req, res) {
  console.log("received a request for "+ req.params.city_name);
  cityModel.find({name: req.params.city_name}, function(err, cities){
      if (err){
        console.log("Error " + err);
      }else{
        console.log("Data "+ JSON.stringify(cities));
      }
      res.send(JSON.stringify(cities));
  });
});
app.get('/cities', function(req, res) {
  cityModel.find({}, function(err, cities){
      if (err){
        console.log("Error " + err);
      }else{
        console.log("Data "+ JSON.stringify(cities));
      }
      res.send(JSON.stringify(cities));
  });
});

app.put("/insert", function(req, res){
  cityModel.create({
    name : req.body.name,
    temperature : req.body.temperature,
    description: req.body.description
  }, function(err, data){
    if(err) console.log(err);
    else
    console.log(data);
    res.send("All good! Inserted.")
  });
})
app.delete("/delete/:city_name", function(req, res){
  cityModel.remove({
    name : req.body.name
  }, function(err, data){
    if(err) console.log(err);
    else
    console.log(data);
    res.send("All good! Delteted.")
  });
})

app.post('/cities', (req, res) => {
  res.json(req.body);
});

var apikey = "efd172570402c278b06459e2135c88c6";

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) {
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + req.body.cityName + "&units=metric&appid=" + apikey;

  https.get(url, function(https_res) {
    https_res.on("data", function(data) {
      res.write("<h1> " + req.body.cityName + " weather is " + JSON.parse(data).weather[0].description) + "</h1>";
      res.write("<h1> " + req.body.cityName + " temp is " + JSON.parse(data).main.temp) + "</h1>";
      res.write('  <img src="' + "http://openweathermap.org/img/wn/" + JSON.parse(data).weather[0].icon + '.png"' + "/>");
      res.send();
    })
  });

})

app.get('/contact', function (req, res) {
  res.send('Hey there, stranger! Here is my <a href="mailto:harryseo92@gmail.com"> email </a>.')
})

app.use(express.static('./public'));
