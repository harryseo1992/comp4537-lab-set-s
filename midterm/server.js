const https = require('https');
const mongoose = require('mongoose');
const express = require('express');
const url = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json";

const { Schema } = mongoose;

var pokeModel = null;

const app = express();
const port = 8899;

