const express = require('express');
const { mongoose, now } = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
var userModel = require('./pokeUser');
const { asyncWrapper } = require('./asyncWrapper');
const {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonBadRequestMissingCount,
  PokemonBadRequestImproperCount,
  PokemonBadRequestMissingAfter,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonImageNotFoundError
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
    throw new PokemonBadRequest("User not found")
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    throw new PokemonBadRequest("Password is incorrect")
  }

  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
  const doc = await userModel.findOneAndUpdate({ username: username }, {$set: { jwt: token }}, options);
  // await user.save();
    // res.uri = doc.jwt;
    res.header('auth-token', token);
    console.log(token);
    // res.cookie('auth', token);
    // console.log(req.cookies);
    res.status(200).send({
      token: doc.jwt
    });
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
    throw new PokemonBadRequest("User not found")
  }
  const doc = await userModel.findOneAndUpdate({ username: username }, {$set: { jwt: "" }}, options);
  res.send(doc);
}))