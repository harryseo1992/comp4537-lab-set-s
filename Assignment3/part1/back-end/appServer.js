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
var pokeLogModel = require("./PokeLogSchema");

app.use(morgan(":method"));

app.use(cors());

const authUser = asyncWrapper(async (req, res, next) => {
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
  const authLog = await pokeLogModel.create({
    username: payload.user.username,
    endpoint: req.path,
    status: new PokemonAuthError().pokeErrCode,
  });
  console.log("AuthLog: " + authLog);
  throw new PokemonAuthError("Access Denied");
});

app.use(authUser);

app.get(
  "/api/v1/pokemons",
  asyncWrapper(async (req, res) => {
    const payload = jwt.verify(
      req.header("auth-token-access"),
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!req.query["count"]) req.query["count"] = 10;
    if (!req.query["after"]) req.query["after"] = 0;
    const docs = await pokemonModel
      .find({})
      .sort({ id: 1 })
      .skip(req.query["after"])
      .limit(req.query["count"]);
    const log = await pokeLogModel.create({
      username: payload.user.username,
      endpoint: req.path,
      status: res.statusCode,
    });
    console.log(log);
    res.json(docs);
  })
);

app.get(
  "/api/v1/pokemon",
  asyncWrapper(async (req, res) => {
    const payload = jwt.verify(
      req.header("auth-token-access"),
      process.env.ACCESS_TOKEN_SECRET
    );
    const { id } = req.query;
    const docs = await pokemonModel.find({ id: id });
    if (docs.length != 0) {
      const log = await pokeLogModel.create({
        username: payload.user.username,
        endpoint: req.path,
        status: res.statusCode,
      });
      console.log(log);
      res.json(docs);
    } else {
      const log = await pokeLogModel.create({
        username: payload.user.username,
        endpoint: req.path,
        status: new PokemonNotFoundError().pokeErrCode,
      });
      console.log(log);
      throw new PokemonNotFoundError("Pokemon not found!");
    }
  })
);
app.use(authAdmin);
app.post(
  "/api/v1/pokemon/",
  asyncWrapper(async (req, res) => {
    const payload = jwt.verify(
      req.header("auth-token-access"),
      process.env.ACCESS_TOKEN_SECRET
    );
    console.log(req.body);
    if (!req.body.id) {
      const log = await pokeLogModel.create({
        username: payload.user.username,
        endpoint: req.path,
        // status: new PokemonBadRequestMissingID().pokeErrCode,
        status: res.statusCode,
      });
      console.log(log);
      throw new PokemonBadRequestMissingID();
    }
    const poke = await pokemonModel.find({ id: req.body.id });
    if (poke.length != 0) {
      const log = await pokeLogModel.create({
        username: payload.user.username,
        endpoint: req.path,
        status: new PokemonDuplicateError().pokeErrCode,
      });
      console.log(log);
      throw new PokemonDuplicateError();
    }
    const pokeDoc = await pokemonModel.create(req.body);
    const log = await pokeLogModel.create({
      username: payload.user.username,
      endpoint: req.path,
      status: res.statusCode,
    });
    console.log(log);
    res.json({
      msg: "Added Successfully",
    });
    // } catch (err) { res.json(handleErr(err)) }
  })
);

app.delete(
  "/api/v1/pokemon",
  asyncWrapper(async (req, res) => {
    const payload = jwt.verify(
      req.header("auth-token-access"),
      process.env.ACCESS_TOKEN_SECRET
    );
    const docs = await pokemonModel.findOneAndRemove({ id: req.query.id });
    if (docs) {
      const log = await pokeLogModel.create({
        username: payload.user.username,
        endpoint: req.path,
        status: res.statusCode,
      });
      console.log(log);
      res.json({
        msg: "Deleted Successfully",
      });
    }
    // res.json({ errMsg: "Pokemon not found" })
    else {
      const log = await pokeLogModel.create({
        username: payload.user.username,
        endpoint: req.path,
        status: new PokemonNotFoundError().pokeErrCode,
      });
      console.log(log);
      throw new PokemonNotFoundError("");
    }
    // } catch (err) { res.json(handleErr(err)) }
  })
);

app.put(
  "/api/v1/pokemon/:id",
  asyncWrapper(async (req, res) => {
    const payload = jwt.verify(
      req.header("auth-token-access"),
      process.env.ACCESS_TOKEN_SECRET
    );
    const selection = { id: req.params.id };
    const update = req.body;
    const options = {
      new: true,
      runValidators: true,
      overwrite: true,
    };
    const doc = await pokeModel.findOneAndUpdate(selection, update, options);
    if (doc) {
      const log = await pokeLogModel.create({
        username: payload.user.username,
        endpoint: req.path,
        status: res.statusCode,
      });
      console.log(log);
      res.json({
        msg: "Updated Successfully",
        pokeInfo: doc,
      });
    } else {
      const log = await pokeLogModel.create({
        username: payload.user.username,
        endpoint: req.path,
        status: new PokemonNotFoundError().pokeErrCode,
      });
      console.log(log);
      throw new PokemonNotFoundError("");
    }
  })
);

app.patch(
  "/api/v1/pokemon/:id",
  asyncWrapper(async (req, res) => {
    const payload = jwt.verify(
      req.header("auth-token-access"),
      process.env.ACCESS_TOKEN_SECRET
    );
    const selection = { id: req.params.id };
    const update = req.body;
    const options = {
      new: true,
      runValidators: true,
    };
    const doc = await pokeModel.findOneAndUpdate(selection, update, options);
    if (doc) {
      const log = await pokeLogModel.create({
        username: payload.user.username,
        endpoint: req.path,
        status: res.statusCode,
      });
      console.log(log);
      res.json({
        msg: "Updated Successfully",
        pokeInfo: doc,
      });
    } else {
      const log = await pokeLogModel.create({
        username: payload.user.username,
        endpoint: req.path,
        status: new PokemonNotFoundError().pokeErrCode,
      });
      console.log(log);
      // res.json({  msg: "Not found" })
      throw new PokemonNotFoundError("");
    }
    // } catch (err) { res.json(handleErr(err)) }
  })
);

app.get(
  "/report",
  asyncWrapper(async (req, res) => {
    const payload = jwt.verify(
      req.header("auth-token-access"),
      process.env.ACCESS_TOKEN_SECRET
    );
    console.log("Report requested");
    const pokeLogDocEndPoints = await pokeLogModel.aggregate([
      {
        $group: {
          _id: "$endpoint",
          count: { $sum: 1 },
        },
      },
    ]);
    const pokeUsers = await userModel.aggregate([
      {
        $group: {
          _id: {
            $add: [
              { $dayOfYear: "$date" },
              { $multiply: [400, { $year: "$date" }] },
            ],
          },
          count: { $sum: 1 },
          first: { $min: "$date" },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 15 },
      { $project: { date: "$first", count: 1, _id: 0 } },
    ]);
    const topAPIUser = await pokeLogModel.aggregate([
      {
        $group: {
          _id: [
            {
              $add: [
                { $dayOfYear: "$created_at" },
                { $multiply: [400, { $year: "$created_at" }] },
              ],
            },
            {
              username: "$username",
            },
          ],
          count: { $sum: 1 },
          first: { $min: "$created_at" },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 15 },
    ]);
    const fourHundredErrorStatusCodes = await pokeLogModel.aggregate([
      {
        $match: {
          $or: [{ status: { $gte: 400, $lt: 500 } }],
        },
      },
      {
        $group: {
          _id: {
            status: "$status",
            endpoint: "$endpoint",
          },
          count: { $sum: 1 },
        },
      },
    ]);
    const allErrorStatusCodes = await pokeLogModel.aggregate([
      {
        $match: {
          $or: [{ status: { $gte: 400 } }],
        },
      },
      {
        $group: {
          _id: {
            status: "$status",
            endpoint: "$endpoint",
          },
          count: { $sum: 1 },
        },
      },
    ]);
    // res.send(`Table ${req.query.id}`);
    if (req.query.id == 1) {
      res.send(pokeUsers);
    }
    if (req.query.id == 2) {
      res.send(topAPIUser);
    }
    if (req.query.id == 3) {
      res.send(pokeLogDocEndPoints);
    }
    if (req.query.id == 4) {
      res.send(fourHundredErrorStatusCodes);
    }
    if (req.query.id == 5) {
      res.send(allErrorStatusCodes);
    }
  })
);

app.use(handleErr);
