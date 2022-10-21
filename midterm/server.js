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
app.use('/pokedex', createProxyMiddleware({
  target: API_BASE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/pokedex": '',
  },
}));

// Start proxy
app.listen(port, () => {
  console.log(`Starting proxy at ${port}`);
})
