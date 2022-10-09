const express = require('express');
const { default: mongoose, MongooseError } = require('mongoose');
const port = 8088;
const { Schema } = mongoose;
const https = require('https');
// const uniqueValidator = require('mongoose-unique-validator');

const app = express();
const typesURL = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json';
const pokemonURL = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json';
var pokemonModelStructure = null;

app.listen(process.env.PORT || port, async () => {
  try {
    // mongoose.connect('mongodb+srv://harryseo:Ehp6KQhDfGFMrBdC@cluster0.yo3qkig.mongodb.net/pokemonDB?retryWrites=true&w=majority');
    const x = await mongoose.connect('mongodb://localhost:27017/test')
    mongoose.connection.db.dropDatabase();
  } catch (err) {
    console.log(err);
  }

  var possibleTypes = [];
  var pokemonSchema = new Schema({
    "base" : {
      "HP" : Number,
      "Attack": Number,
      "Defense": Number,
      "Speed": Number,
      "Sp. Attack": Number,
      "Sp. Defense": Number
    },
    "id": {
      type: Number,
      unique: true
    },
    "name": {
      "english": {type: String, maxlength: 20},
      "japanese": {type: String, maxlength: 20},
      "chinese": {type: String, maxlength: 20},
      "french": {type: String, maxlength: 20}
    },
    "type": possibleTypes
  })

  // pokemonSchema.plugin(uniqueValidator);

  await https.get(typesURL, async (res) => {
      var body = '';
      res.setEncoding('utf-8');
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", (data) => {
        const arr = JSON.parse(body);
        arr.map(element => {
          possibleTypes.push(element);
        })
      })
  });

  const pokemonModel = mongoose.model('pokemons', pokemonSchema);

  // grab pokeymans
  https.get(pokemonURL, (res) => {
    var chunks = '';
    res.on("data", (chunk) => {
      chunks += chunk;
    });
    res.on("end", (data) => {
      const arr = JSON.parse(chunks);
      arr.map(element => {
        pokemonModel.create(element, (err) => {
          if (err) console.log(err);
        })
      })
    })
  });
  pokemonModelStructure = pokemonModel;
})
app.use(express.json());

app.get('/api/v1/:params', (req, res) => {
  if (req.params != "pokemons/*" || req.params != "pokemon/*" || req.params != "pokemonImage/*") {
    res.json({msg: "Improper route. Check API docs plz."})
  }
})

app.get('/api/v1/pokemons', (req, res) => {
  const count = req.query.count;
  const after = req.query.after;
  pokemonModelStructure.find()
    .sort({id: 1})
    .limit(count)
    .skip(after)
    .then(docs => {
      console.log(docs);
      res.json(docs);
    })
    .catch (err => {
      console.error(err);
      res.json({
        msg: "Pokemons not found."
      });
    });
})     // - get all the pokemons after the 10th. List only Two.

app.post('/api/v1/pokemon', (req, res) => {
  pokemonModelStructure.create(req.body, (err) => {
    if (err) {
      if (err.name == 'ValidationError') {
        res.json({errMsg: "ValidationError: check your ..."})
      } else {
        res.json({errMsg: err});
      }
    } else {
      res.json({ msg: "Added Successfully"});
    }
  });
})                      // - create a new pokemon

app.get('/api/v1/pokemon/:id', (req, res) => {
  if (isNumber(req.params.id)) {
    pokemonModelStructure.find({id: req.params.id})
      .then(doc => {
        if (doc && doc.length) {
          res.json(doc);
        } else {
          res.json({errMsg: "Pokemon not found"});
        }
      })
      .catch(err => {
        console.log(err);
        res.json({ 
          errMsg: "Pokemon not found"
        })
      })
  } else {
    res.json({
      errMsg: "Cast Error: pass pokemon id between 1 and 811"
    })
  }
})                   // - get a pokemon

app.get('/api/v1/pokemonImage/:id', (req, res) => {
  // url = https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/001.png
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
  if (req.params.id > 811) {
    res.json({errMsg: "Pokemon image not found"});
    return
  }
  pokemonModelStructure.findOne({id: req.params.id})
    .then(doc => {
      res.json({
        pokemon: doc.name.english,
        id: doc.id,
        image: {
          URL: `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${pngNumValue}.png`
        }
      })
    })
    .catch(err => {
      console.error(err);
      res.json({errMsg: "Pokemon image not found"});
    })
})              // - get a pokemon Image URL