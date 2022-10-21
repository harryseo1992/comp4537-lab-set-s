const https = require('https');
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const url = process.env.API_BASE_URL;
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();
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
