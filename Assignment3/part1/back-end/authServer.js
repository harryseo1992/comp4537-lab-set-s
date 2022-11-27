const express = require("express");
const { mongoose, now } = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
var userModel = require("./pokeUser");
var refreshTokenModel = require("./RefreshToken");
const { asyncWrapper } = require("./asyncWrapper");
const {
  PokemonBadRequestUserNotFound,
  PokemonBadRequestWrongPassword,
  PokemonDbError,
  PokemonAuthError,
} = require("./pokemonErrors");

const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.listen(process.env.AUTHPORT, async () => {
  try {
    // mongoose.connect('mongodb+srv://harryseo:Ehp6KQhDfGFMrBdC@cluster0.yo3qkig.mongodb.net/pokemonDatabase?retryWrites=true&w=majority');
    const x = await mongoose.connect(process.env.DB_STRING);
    mongoose.connection.db.dropDatabase();
  } catch (err) {
    throw new PokemonDbError(err);
  }
});
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    exposedHeaders: ["auth-token-access", "auth-token-refresh"],
  })
);

const bcrypt = require("bcrypt");
app.post(
  "/register",
  asyncWrapper(async (req, res) => {
    const { username, password, email, isAdmin } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userWithHashedPassword = { ...req.body, password: hashedPassword };

    const user = await userModel.create(userWithHashedPassword);
    res.send(user);
  })
);

const jwt = require("jsonwebtoken");
app.post(
  "/requestNewAccessToken",
  asyncWrapper(async (req, res) => {
    const refreshToken = req.header("auth-token-refresh");
    if (!refreshToken) {
      throw new PokemonAuthError("No Token: Please provide a token");
    }
    var isRefreshTokenInDb = await refreshTokenModel.find({
      refreshToken: refreshToken,
    });
    if (isRefreshTokenInDb) {
      console.log("token: ", refreshToken);
      throw new PokemonAuthError(
        "Invalid Toekn: Please provide a valid token."
      );
    }
    try {
      const payload = await jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const accessToken = jwt.sign(
        { user: payload.user },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10s" }
      );
      res.header("auth-token-access", accessToken);
      res.send("Your access token has been renewed!");
    } catch (error) {
      throw new PokemonAuthError(
        "Invalid Token: Please provide a valid token."
      );
    }
  })
);
app.post(
  "/login",
  asyncWrapper(async (req, res) => {
    const { username, password } = req.body;
    const options = {
      new: true,
      runValidators: true,
      overwrite: true,
    };
    const user = await userModel.findOne({ username });
    if (!user) {
      throw new PokemonBadRequestUserNotFound();
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new PokemonBadRequestWrongPassword();
    }

    // Create and assign a token
    const accessToken = jwt.sign(
      { user: user },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );
    const refreshToken = jwt.sign(
      { user: user },
      process.env.REFRESH_TOKEN_SECRET
    );
    // refreshTokens.push(refreshToken); update into refreshTokenModel
    refreshTokenModel.create({ refreshToken: refreshToken });

    res.header("auth-token-access", accessToken);
    res.header("auth-token-refresh", refreshToken);

    // res.send("All good!")
    res.send(user);
  })
);

app.post(
  "/logout",
  asyncWrapper(async (req, res) => {
    const { username } = req.body;
    const options = {
      new: true,
      runValidators: true,
      overwrite: true,
    };
    const user = await userModel.findOne({ username: username });
    if (!user) {
      throw new PokemonBadRequestUserNotFound();
    }
    const doc = await userModel.findOneAndUpdate(
      { username: username },
      { $set: { isJwtInvalidated: true } },
      options
    );
    res.send(doc);
  })
);
