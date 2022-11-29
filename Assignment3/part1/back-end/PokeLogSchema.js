const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
  },
});

module.exports = mongoose.model("pokeLog", schema);
