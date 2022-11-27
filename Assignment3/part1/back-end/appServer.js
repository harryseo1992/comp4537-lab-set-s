const express = require("express");
const { mongoose } = require("mongoose");
const https = require("https");
const { returnPokemonSchema } = require("./pokemonSchema");
const { asyncWrapper } = require("./asyncWrapper");
const { handleErr } = require("./errorHandler.js");
const morgan = require("morgan");
const cors = require("cors");
const {
  PokemonBadRequestMissingID,
  PokemonNotFoundError,
  PokemonDuplicateError,
  PokemonAuthError,
} = require("./pokemonErrors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const typesURL =
  "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json";
const pokemonURL =
  "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json";
var pokemonModel = null;

app.listen(process.env.SERVERPORT || port, async () => {
  try {
    // mongoose.connect('mongodb+srv://harryseo:Ehp6KQhDfGFMrBdC@cluster0.yo3qkig.mongodb.net/pokemonDatabase?retryWrites=true&w=majority');
    const x = await mongoose.connect(process.env.DB_STRING);
    mongoose.connection.db.dropDatabase();
  } catch (err) {
    console.log(err);
  }

  // var possibleTypes = null;
  var pokemonSchema = await returnPokemonSchema();

  pokemonModel = mongoose.model("pokemons", pokemonSchema);

  // grab pokeymans
  https.get(pokemonURL, (res) => {
    var chunks = "";
    res.on("data", (chunk) => {
      chunks += chunk;
    });
    res.on("end", (data) => {
      const arr = JSON.parse(chunks);
      arr.map((element) => {
        element["base"]["Speed Attack"] = element["base"]["Sp. Attack"];
        delete element["base"]["Sp. Attack"];
        element["base"]["Speed Defense"] = element["base"]["Sp. Defense"];
        delete element["base"]["Sp. Defense"];
        pokemonModel.create(element, (err) => {
          if (err) console.log(err);
        });
      });
    });
  });
});
app.use(express.json());

const jwt = require("jsonwebtoken");
var userModel = require("./pokeUser");

app.use(morgan(":method"));

app.use(cors());

const authUser = asyncWrapper(async (res, res, next) => {
  const token = req.header("auth-token-access");

  if (!token) {
    throw new PokemonAuthError(
      "No Token: Please provide the access token using headers"
    );
  }

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (error) {
    throw new PokemonAuthError("invalid Token");
  }
});

const authAdmin = asyncWrapper(async (req, res, next) => {
  const payload = jwt.verify(
    req.header("auth-token-access"),
    process.env.ACCESS_TOKEN_SECRET
  );
  if (payload?.user?.role == "admin") {
    return next();
  }
  throw new PokemonAuthError("Access Denied");
});

app.use(authUser);

app.get(
  "/api/v1/pokemons",
  asyncWrapper(async (req, res) => {
    if (!req.query["count"]) req.query["count"] = 10;
    if (!req.query["after"]) req.query["after"] = 0;
    // try {
    const docs = await pokeModel
      .find({})
      .sort({ id: 1 })
      .skip(req.query["after"])
      .limit(req.query["count"]);
    res.json(docs);
    // } catch (err) { res.json(handleErr(err)) }
  })
);

app.get(
  "/api/v1/pokemon",
  asyncWrapper(async (req, res) => {
    // try {
    const { id } = req.query;
    const docs = await pokeModel.find({ id: id });
    if (docs.length != 0) res.json(docs);
    else res.json({ errMsg: "Pokemon not found" });
    // } catch (err) { res.json(handleErr(err)) }
  })
);

// app.get("*", (req, res) => {
//   // res.json({
//   //   msg: "Improper route. Check API docs plz."
//   // })
//   throw new PokemonNoSuchRouteError("");
// })

app.use(authAdmin);
app.post(
  "/api/v1/pokemon/",
  asyncWrapper(async (req, res) => {
    // try {
    console.log(req.body);
    if (!req.body.id) throw new PokemonBadRequestMissingID();
    const poke = await pokeModel.find({ id: req.body.id });
    if (poke.length != 0) throw new PokemonDuplicateError();
    const pokeDoc = await pokeModel.create(req.body);
    res.json({
      msg: "Added Successfully",
    });
    // } catch (err) { res.json(handleErr(err)) }
  })
);

app.delete(
  "/api/v1/pokemon",
  asyncWrapper(async (req, res) => {
    // try {
    const docs = await pokeModel.findOneAndRemove({ id: req.query.id });
    if (docs)
      res.json({
        msg: "Deleted Successfully",
      });
    // res.json({ errMsg: "Pokemon not found" })
    else throw new PokemonNotFoundError("");
    // } catch (err) { res.json(handleErr(err)) }
  })
);

app.put(
  "/api/v1/pokemon/:id",
  asyncWrapper(async (req, res) => {
    // try {
    const selection = { id: req.params.id };
    const update = req.body;
    const options = {
      new: true,
      runValidators: true,
      overwrite: true,
    };
    const doc = await pokeModel.findOneAndUpdate(selection, update, options);
    // console.log(docs);
    if (doc) {
      res.json({
        msg: "Updated Successfully",
        pokeInfo: doc,
      });
    } else {
      // res.json({ msg: "Not found", })
      throw new PokemonNotFoundError("");
    }
    // } catch (err) { res.json(handleErr(err)) }
  })
);

app.patch(
  "/api/v1/pokemon/:id",
  asyncWrapper(async (req, res) => {
    // try {
    const selection = { id: req.params.id };
    const update = req.body;
    const options = {
      new: true,
      runValidators: true,
    };
    const doc = await pokeModel.findOneAndUpdate(selection, update, options);
    if (doc) {
      res.json({
        msg: "Updated Successfully",
        pokeInfo: doc,
      });
    } else {
      // res.json({  msg: "Not found" })
      throw new PokemonNotFoundError("");
    }
    // } catch (err) { res.json(handleErr(err)) }
  })
);

app.get("/report", (req, res) => {
  console.log("Report requested");
  res.send(`Table ${req.query.id}`);
});

app.use(handleErr);
