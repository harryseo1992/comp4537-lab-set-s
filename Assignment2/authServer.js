const express = require('express');
const { mongoose, now } = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
var userModel = require('./pokeUser');
const { asyncWrapper } = require('./asyncWrapper');
const {
  PokemonBadRequest,
  PokemonBadRequestUserNotFound,
  PokemonBadRequestWrongPassword,
  PokemonBadRequestInvalidatedToken,
  PokemonBadRequestTokenNotFound,
  PokemonBadRequestUserIsNotAdmin,
  PokemonBadRequestMissingID,
  PokemonBadRequestMissingCount,
  PokemonBadRequestImproperCount,
  PokemonBadRequestMissingAfter,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonImageNotFoundError,
  PokemonDuplicateError,
  PokemonNoSuchRouteError
} = require('./pokemonErrors');

const app = express();
const cookieParser = require('cookie-parser');

app.listen(process.env.AUTHPORT, async () => {
  try {
    // mongoose.connect('mongodb+srv://harryseo:Ehp6KQhDfGFMrBdC@cluster0.yo3qkig.mongodb.net/pokemonDatabase?retryWrites=true&w=majority');
    const x = await mongoose.connect(process.env.DB_STRING)
    mongoose.connection.db.dropDatabase();
  } catch (err) {
    throw new PokemonDbError(err);
  }
})
app.use(express.json());
app.use(cookieParser());

const bcrypt = require("bcrypt")
app.post('/register', asyncWrapper(async (req, res) => {
  const { username, password, email, isAdmin } = req.body
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const userWithHashedPassword = { ...req.body, password: hashedPassword }

  const user = await userModel.create(userWithHashedPassword)
  res.send(user)
}));

const jwt = require("jsonwebtoken")
app.post('/login', asyncWrapper(async (req, res) => {
  const { username, password } = req.body
  const options = {
    new: true,
    runValidators: true,
    overwrite: true
  }
  const user = await userModel.findOne({ username })
  if (!user) {
    throw new PokemonBadRequestUserNotFound();
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    throw new PokemonBadRequestWrongPassword();
  }

  // Create and assign a token
  if (user.jwt == "") {
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    const doc = await userModel.findOneAndUpdate({ username: username }, {$set: { jwt: token, isJwtInvalidated: false }}, options);
    res.status(200).send(doc);
  }

  const doc = await userModel.findOneAndUpdate({ username: username }, {$set: { isJwtInvalidated: false }}, options);
  res.status(200).send(doc);
}));

app.post('/logout', asyncWrapper(async (req, res) => {
  const { username } = req.body;
  const options = {
    new: true,
    runValidators: true,
    overwrite: true
  };
  const user = await userModel.findOne({ username })
  if (!user) {
    throw new PokemonBadRequestUserNotFound();
  }
  const doc = await userModel.findOneAndUpdate({ username: username }, {$set: { isJwtInvalidated: true }}, options);
  res.send(doc);
}))