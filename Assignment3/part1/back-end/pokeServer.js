const express = require('express');
const { mongoose, now } = require('mongoose');
const port = 8088;
const https = require('https');
const fs = require('fs');
const { returnPokemonSchema } = require('./pokemonSchema');
const { asyncWrapper } = require('./asyncWrapper');
const { handleErr } = require("./errorHandler.js")
const {
  PokemonBadRequest,
  PokemonBadRequestUserNotFound,
  PokemonBadRequestWrongPassword,
  PokemonBadRequestInvalidatedToken,
  PokemonBadRequestTokenNotFound,
  PokemonBadRequestInvalidToken,
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
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
var userModel = require('./pokeUser');

const app = express();
const typesURL = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json';
const pokemonURL = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json';
var pokemonModel = null;

app.listen(process.env.POKEPORT || port, async () => {
  try {
    // mongoose.connect('mongodb+srv://harryseo:Ehp6KQhDfGFMrBdC@cluster0.yo3qkig.mongodb.net/pokemonDatabase?retryWrites=true&w=majority');
    const x = await mongoose.connect(process.env.DB_STRING)
    mongoose.connection.db.dropDatabase();
  } catch (err) {
    console.log(err);
  }

  // var possibleTypes = null;
  var pokemonSchema = await returnPokemonSchema(); 

  pokemonModel = mongoose.model('pokemons', pokemonSchema);

  // grab pokeymans
  https.get(pokemonURL, (res) => {
    var chunks = '';
    res.on("data", (chunk) => {
      chunks += chunk;
    });
    res.on("end", (data) => {
      const arr = JSON.parse(chunks);
      arr.map(element => {
        element["base"]["Speed Attack"] = element["base"]["Sp. Attack"];
        delete element["base"]["Sp. Attack"];
        element["base"]["Speed Defense"] = element["base"]["Sp. Defense"];
        delete element["base"]["Sp. Defense"];
        pokemonModel.create(element, (err) => {
          if (err) console.log(err);
        })
      })
    })
  });
})
app.use(express.json());
app.use(cookieParser());
// ----helper function

const isNumber = (number) => {
  return !isNaN(parseFloat(number)) && !isNaN(number - 0);
}

const jwt = require("jsonwebtoken")

const auth = asyncWrapper(async (req, res, next) => {
  const token = req.query.token;
  // const { auth } = req.cookies;
  if (!token) {
  // if (!auth) {
    throw new PokemonBadRequestTokenNotFound();
  }
  const rootUser = await userModel.findOne({ jwt: token });
  if (!rootUser) {
    throw new PokemonBadRequestUserNotFound();
  }
  if (rootUser.isJwtInvalidated) {
    throw new PokemonBadRequestInvalidatedToken();
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET) // nothing happens if token is valid
    // const verified = jwt.verify(auth, process.env.TOKEN_SECRET) // nothing happens if token is valid
    next()
  } catch (err) {
    throw new PokemonBadRequestInvalidToken();
  }
})

app.use(auth) // Boom! All routes below this line are protected

app.get('/api/v1/pokemons', asyncWrapper(async (req, res) => {
  if (!req.query["count"])
    req.query["count"] = 10
  if (!req.query["after"])
    req.query["after"] = 0
  // try {
  const docs = await pokemonModel.find({})
    .sort({ "id": 1 })
    .skip(req.query["after"])
    .limit(req.query["count"])
  res.json(docs)
}))

app.get('/api/v1/pokemon/:id', asyncWrapper(async (req, res, next) => {
  if (!req.params.id) {
    return next(new PokemonBadRequestMissingID("Missing ID"));
  }
  var docs = await pokemonModel.find({id: req.params.id})
  if (docs.length != 0) res.json(docs)
  else return next(new PokemonNotFoundError("Pokemon not found!"));
}))

const adminAuth = asyncWrapper(async (req, res, next) => {
  const token = req.query.token;
  // const { auth } = req.cookies;
  if (!token) {
  // if (!auth) {
    throw new PokemonBadRequestTokenNotFound();
  }
  const rootUser = await userModel.findOne({ jwt: token });
  if (!rootUser) {
    throw new PokemonBadRequestUserNotFound();
  }
  if (rootUser.isJwtInvalidated) {
    throw new PokemonBadRequestInvalidatedToken();
  }
  if (!rootUser.isAdmin) {
    throw new PokemonBadRequestUserIsNotAdmin();
  }
  next();
})

app.use(adminAuth);

app.post('/api/v1/pokemon', asyncWrapper(async (req, res, next) => {
  if (!req.body.id) throw new PokemonBadRequestMissingID();
  const poke = await pokemonModel.find({ "id": req.body.id });
  if (poke.length != 0) throw new PokemonDuplicateError();
  const newPokemon = await pokemonModel.create(req.body);
  res.json({
    msg: "Added Successfully"
  })
}))                      // - create a new pokemon                 // - get a pokemon

app.get('/api/v1/pokemonImage/:id', asyncWrapper(async (req, res, next) => {
  var pngNumValue;
  if (isNumber(req.params.id) && req.params.id < 10) {
    pngNumValue = `00${req.params.id}`
  }
  if (isNumber(req.params.id) && req.params.id > 10 && req.params.id < 100) {
    pngNumValue = `0${req.params.id}`;
  }
  if (isNumber(req.params.id) && req.params.id > 100) {
    pngNumValue = `${req.params.id}`;
  }
  if (req.params.id > 809) {
    return next(new PokemonImageNotFoundError("Pokemon image not found!"));
  }
  var pokemonObject = await pokemonModel.findOne({id: req.params.id});
  if (pokemonObject.length != 0) {
    res.json({
      pokemon: pokemonObject.name.english,
      id: pokemonObject.id,
      image: {
        URL: `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${pngNumValue}.png`
      }
    });
  }
}))              // - get a pokemon Image URL

app.put('/api/v1/pokemon/:id', asyncWrapper(async (req, res, next) => {
  const { ...rest } = req.body;
  await pokemonModel.updateOne({ id: req.params.id }, {$set: {...rest}}, { upsert: true })
  res.json({
    msg: "Updated Successfully",
    pokeInfo: { id: req.params.id, ...rest}
  })
}))                   // - upsert a whole pokemon document

app.patch('/api/v1/pokemon/:id', asyncWrapper(async (req, res, next) => {
  const { ...rest } = req.body;
  await pokemonModel.updateOne({ id: req.params.id }, {$set: {...rest}}, { runValidators: true })
  res.json({
    msg:"Updated Successfully",
    pokeInfo: { id: req.params.id, ...rest}
  });
}))                 // - patch a pokemon document or a portion of the pokemon document

app.delete('/api/v1/pokemon/:id', asyncWrapper(async (req, res, next) => {
  var pokemonObjectForDeletion = await pokemonModel.findOneAndRemove( { id: req.params.id });
  if (pokemonObjectForDeletion) {
    res.json({
      msg: "Deleted Successfully"
    });
  } else {
    return next(new PokemonNotFoundError("Pokemon not found!"));
  }
}))                // - delete a  pokemon 

app.get('/api/doc', (req, res) => {
  var path = __dirname + 'apidoc.md';
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
    }
    res.send(marked(data.toString()));
  })
})

app.get("*", (req, res) => {
  throw new PokemonNoSuchRouteError();
})

app.use(handleErr)
