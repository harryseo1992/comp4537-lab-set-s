const https = require('https');
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const url = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json";

const { Schema } = mongoose;

var pokeModel = null;

const app = express();
const port = 8899;

app.listen(port, async () => {
  try {
    const x = await mongoose.connect('mongodb://localhost:27017/test')
    mongoose.connection.db.dropDatabase();
  } catch (error) {
    console.log ('db error');
  }

  var possibleTypes = [];
  var pokeSchema = null;

  await https.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json", async (res) => {
    var chunks = "";
    res.on("data", function (chunk) {
      chunks += chunk;
    });
    await res.on("end", async (data) => {
      possibleTypes = JSON.parse(chunks)
      possibleTypes = await possibleTypes.map(element => element.english);
      pokeSchema = new Schema({
        "id": {
          type: Number,
          unique: [true, "You cannot have two pokemons with the same id"]
        },
        "name": {
          "english": {
            type: String,
            required: true,
            maxlength: [20, "Name should be less than 20 characters long"]
          },
          "japanese": String,
          "chinese": String,
          "french": String
        },
        "type": possibleTypes,
        "base": {
          "HP": Number,
          "Attack": Number,
          "Defense": Number,
          "Speed Attack": Number,
          "Speed Defense": Number,
          "Speed": Number
        }
      })
      pokeModel = mongoose.model('pokemons', pokeSchema);
    });
  })
})

app.get('/api/v1/pokemons', (req, res) => {
  if (!req.query["count"]) {
    req.query["count"] = 10;
  }
  if (!req.query["after"]) {
    req.query["after"] = 0
  }

  try {
    // var result = null;
    https.get(url, function (response) {
      var chunks = "";
      response.on("data", function (chunk) {
        chunks += chunk;
      });
      response.on("end", function (data) {
        const arr = JSON.parse(chunks);
        arr.map(element => {
          element["base"]["Speed Attack"] = element["base"]["Sp. Attack"];
          delete element["base"]["Sp. Attack"];
          element["base"]["Speed Defense"] = element["base"]["Sp. Defense"];
          delete element["base"]["Sp. Defense"];
        });
        var result = [];
        for (let i = 0; i < req.query['count']; i++) {
          if (arr[i].id > req.query["after"]) {
            result.push(arr[i])
          }
        }
        res.json(result);
      })
    });
  } catch (err) {
    res.json(handleErr(err));
  }
})

app.get("*", (req, res) => {
  res.json({
    errMsg: "Improper route. Check API docs please"
  })
})

function handleErr(err) {
  console.log(err);
  if (err instanceof mongoose.Error.ValidationError) {
    return ({ errMsg: "ValidationError: check your ..." })
  } else if (err instanceof mongoose.Error.CastError) {
    return ({ errMsg: "CastError: check your ..." })
  } else {
    return ({ errMsg: err })
  }
}