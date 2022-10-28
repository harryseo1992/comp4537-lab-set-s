const express = require('express');
const { mongoose } = require('mongoose');
const port = 8088;
const https = require('https');
const fs = require('fs');
const { returnPokemonSchema } = require('./pokemonSchema');


const app = express();
const typesURL = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json';
const pokemonURL = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json';
var pokemonModel = null;

app.listen(process.env.PORT || port, async () => {
  try {
    // mongoose.connect('mongodb+srv://harryseo:Ehp6KQhDfGFMrBdC@cluster0.yo3qkig.mongodb.net/pokemonDatabase?retryWrites=true&w=majority');
    const x = await mongoose.connect('mongodb://localhost:27017/test')
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

class PokemonBadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequest";
  }
}

class PokemonBadRequestMissingID extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestMissingID";
  }
}

class PokemonBadRequestMissingCount extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestMissingCount";
  }
}

class PokemonBadRequestImproperCount extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestImproperCount";
  }
}

class PokemonBadRequestMissingAfter extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestMissingAfter";
  }
}

class PokemonBadRequestImproperAfter extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestImproperAfter";
  }
}

class PokemonBadRequestImproperIDFormat extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestImproperIDFormat";
  }
}

class PokemonDbError extends Error {
  constructor(message) {
    super(message);
    this.name = "PokemonDbError";
  }
}

class PokemonNotFoundError extends PokemonDbError {
  constructor(message) {
    super(message);
    this.name = "PokemonNotFoundError";
  }
}

class PokemonImageNotFoundError extends PokemonDbError {
  constructor(message) {
    super(message);
    this.name = "PokemonImageNotFoundError";
  }
}

app.get('/api/v1/pokemons', (req, res, next) => {
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
    .catch (err => {
      return next(new PokemonDbError(err)); // TODO: This crashes the server. Find a way to not crash it
    });
  }
})     // - get all the pokemons after the 10th. List only Two.

app.post('/api/v1/pokemon', (req, res) => {
  pokemonModel.create(req.body, (err) => {
    if (err) {
      if (err.name == 'ValidationError') {
        res.json({errMsg: "ValidationError: check to make sure your inputs are correct"})
      } else {
        res.json({errMsg: err});
      }
    } else {
      res.json({ msg: "Added Successfully"});
    }
  });
})                      // - create a new pokemon

app.get('/api/v1/pokemon/:id', async (req, res, next) => {
  if (!req.params.id) {
    return next(new PokemonBadRequestMissingID("Missing ID"));
  }
  try {
    var docs = await pokemonModel.find({id: req.params.id})
    if (docs.length != 0) res.json(docs)
    else return next(new PokemonNotFoundError("Pokemon not found!"));
  } catch (error) {
    return next(new PokemonBadRequestImproperIDFormat("CastingError: pass pokemon id between 1 and 809"))
  }
})                   // - get a pokemon

app.get('/api/v1/pokemonImage/:id', (req, res, next) => {
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
  try {
    var pokemonObject = pokemonModel.findOne({id: req.params.id});
    if (pokemonObject.length != 0) {
      res.json({
        pokemon: doc.name.english,
        id: doc.id,
        image: {
          URL: `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${pngNumValue}.png`
        }
      });
    }
  } catch (error) {
    return next(new PokemonDbError(error));
  }
})              // - get a pokemon Image URL

app.put('/api/v1/pokemon/:id', async (req, res) => {
  const { ...rest } = req.body;
  try {
    await pokemonModel.updateOne({ id: req.params.id }, {$set: {...rest}}, { upsert: true })
    res.json({
      msg: "Updated Successfully",
      pokeInfo: { id: req.params.id, ...rest}
    })
  } catch (err) {
    res.json({errMsg: "ValidationError: check to make sure your inputs are correct"})
  }
})                   // - upsert a whole pokemon document

app.patch('/api/v1/pokemon/:id', async (req, res) => {
  const { ...rest } = req.body;
  try {
    await pokemonModel.updateOne({ id: req.params.id }, {$set: {...rest}}, { runValidators: true })
    res.json({
      msg:"Updated Successfully",
      pokeInfo: { id: req.params.id, ...rest}
    });
  } catch (err) {
    console.log(err.errMsg);
    res.json({
      errMsg: "ValidationError: check to make sure your inputs are correct"
    })
  }
})                 // - patch a pokemon document or a portion of the pokemon document

app.delete('/api/v1/pokemon/:id', async (req, res) => {
  var deletedData;
  await pokemonModel.find( { id: req.params.id })
    .then(doc => {
      if (doc && doc.length) {
        deletedData = doc[0];
        pokemonModel.findOneAndDelete({ id: req.params.id }, (err, res) => {
          if (err) {
            res.json({errMsg: "Pokemon not found"});
          }
        })
        res.json({
          msg: "Deleted Successfully",
          pokeInfo: deletedData
        })
      } else {
        res.json({errMsg: "Pokemon not found"})
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({errMsg: "Pokemon not found"});
    })
})                // - delete a  pokemon 

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
  if (err instanceof PokemonBadRequestMissingAfter) {
    res.status(400).send(err.message);
  } else if (err instanceof PokemonBadRequestMissingID) {
    res.status(400).send(err.message);
  } else if (err instanceof PokemonDbError) {
    res.status(500).send(err.message);
  } else if (err instanceof PokemonNotFoundError) {
    res.status(400).send(err.message);
  } else if (err instanceof PokemonImageNotFoundError) {
    res.status(400).send(err.message);
  } else {
    res.status(500).send(err.message);
  }
})