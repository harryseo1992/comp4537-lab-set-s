const express = require('express');
const { mongoose, now } = require('mongoose');
const port = 8088;
const https = require('https');
const fs = require('fs');
const { returnPokemonSchema } = require('./pokemonSchema');
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
const dotenv = require('dotenv');
dotenv.config();


const app = express();
const typesURL = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json';
const pokemonURL = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json';
var pokemonModel = null;
var userModel = require('./pokeUser');

app.listen(process.env.PORT || port, async () => {
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

// ----helper function

const isNumber = (number) => {
  return !isNaN(parseFloat(number)) && !isNaN(number - 0);
}

const bcrypt = require("bcrypt")
app.post('/register', asyncWrapper(async (req, res) => {
  const { username, password, email } = req.body
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const userWithHashedPassword = { ...req.body, password: hashedPassword }

  const user = await userModel.create(userWithHashedPassword)
  res.send(user)
}))

app.post('/login', asyncWrapper(async (req, res) => {
  const { username, password } = req.body
  const user = await userModel.findOne({ username })
  if (!user) {
    throw new PokemonBadRequest("User not found")
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    throw new PokemonBadRequest("Password is incorrect")
  }
  res.send(user)
}))

app.get('/api/v1/pokemons', asyncWrapper(async (req, res, next) => {
  const count = req.query.count;
  const after = req.query.after;
  if ((!count && after)) {
    throw new PokemonBadRequestMissingCount("count value is missing");
  } else if ((count && !after)) {
    throw new PokemonBadRequestMissingAfter("after value is missing");
  } else {
    pokemonModel.find()
    .sort({id: 1})
    .limit(count)
    .skip(after)
    .then(docs => {
      if ((count && docs && docs.length == count) || (!count && docs && docs.length)) {
        console.log(docs);
        res.json(docs);
      } else {
        return next(new PokemonBadRequestImproperCount(`Cannot find ${count} pokemon(s) after id: ${after}`));
      }
    })
  }
}))     // - get all the pokemons after the 10th. List only Two.

app.post('/api/v1/pokemon', asyncWrapper(async (req, res, next) => {
  const newPokemon = await pokemonModel.create(req.body);
  res.json({
    msg: "Added Successfully"
  })
}))                      // - create a new pokemon

app.get('/api/v1/pokemon/:id', asyncWrapper(async (req, res, next) => {
  if (!req.params.id) {
    return next(new PokemonBadRequestMissingID("Missing ID"));
  }
  var docs = await pokemonModel.find({id: req.params.id})
  if (docs.length != 0) res.json(docs)
  else return next(new PokemonNotFoundError("Pokemon not found!"));
}))                   // - get a pokemon

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
  res.json({
    msg: "Improper route. Check API docs plz."
  })
})

app.use((err, req, res, next) => {
  if (err instanceof PokemonBadRequest) {
    res.status(400).send(err.message);
  } else if (err instanceof PokemonDbError) {
    res.status(500).send(err.message);
  } else {
    res.status(500).send(err.message);
  }
})