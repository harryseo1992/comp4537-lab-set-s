const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("refreshTokens", schema);
