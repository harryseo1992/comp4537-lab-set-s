class PokemonBadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequest";
    this.message = "Error - Bad request: check the API doc";
    this.pokeErrCode = 400;
  }
}

class PokemonBadRequestMissingID extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestMissingID";
    this.message = "Error - Bad request - missing ID: check the API doc";
    this.pokeErrCode = 400;
  }
}

class PokemonBadRequestUserNotFound extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestUserNotFound";
    this.message = "Error - Bad request - User not found";
    this.pokeErrCode = 400;
  }
}

class PokemonBadRequestWrongPassword extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestWrongPassword";
    this.message = "Error - Bad request - Wrong password";
    this.pokeErrCode = 400;
  }
}

class PokemonBadRequestInvalidToken extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestInvalidToken";
    this.message = "Error - Bad request - Invalid Token";
    this.pokeErrCode = 400;
  }
}

class PokemonBadRequestInvalidatedToken extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestInvalidatedToken";
    this.message = "Error - Bad request - Token invalidated";
    this.pokeErrCode = 400;
  }
}

class PokemonBadRequestTokenNotFound extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestTokenNotFound";
    this.message = "Error - Bad request - Token not found";
    this.pokeErrCode = 400;
  }
}

class PokemonBadRequestUserIsNotAdmin extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestUserIsNotAdmin";
    this.message =
      "Error - Bad request - Current user does not have admin privileges";
    this.pokeErrCode = 400;
  }
}

class PokemonBadRequestMissingCount extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestMissingCount";
    this.message = "Error - Bad request - missing count: check the API doc";
    this.pokeErrCode = 400;
  }
}

class PokemonBadRequestImproperCount extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestImproperCount";
    this.message =
      "Error - Bad request - improper count value: check the API doc";
    this.pokeErrCode = 400;
  }
}

class PokemonBadRequestMissingAfter extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonBadRequestMissingAfter";
    this.message = "Error - Bad request - missing after: check the API doc";
    this.pokeErrCode = 400;
  }
}

class PokemonDuplicateError extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonDuplicateError";
    this.message =
      "Error - PokemonDuplicateError: The Pokemons has already been inserted.";
    this.pokeErrCode = 400;
  }
}

class PokemonDbError extends Error {
  constructor(message) {
    super(message);
    this.name = "PokemonDbError";
    this.message = "Error - DB error: Contact API owners for more info.";
    this.pokeErrCode = 500;
  }
}

class PokemonNotFoundError extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonNotFoundError";
    this.message = "Error - Bad request - pokemon not found: check the API doc";
    this.pokeErrCode = 400;
  }
}

class PokemonImageNotFoundError extends PokemonDbError {
  constructor(message) {
    super(message);
    this.name = "PokemonImageNotFoundError";
    this.message = "Error - DB error: Contact API owners for more info.";
    this.pokeErrCode = 500;
  }
}

class PokemonNoSuchRouteError extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonNoSuchRouteError";
    this.message = "Error - Improper Route: check the API doc";
    this.pokeErrCode = 404;
  }
}
class PokemonAuthError extends PokemonBadRequest {
  constructor(message) {
    super(message);
    this.name = "PokemonAuthError";
    this.message = `Poke API Error - Authentication Error: ${message}`;
    this.pokeErrCode = 401;
  }
}

module.exports = {
  PokemonBadRequest,
  PokemonBadRequestUserNotFound,
  PokemonBadRequestWrongPassword,
  PokemonBadRequestInvalidatedToken,
  PokemonBadRequestTokenNotFound,
  PokemonBadRequestUserIsNotAdmin,
  PokemonBadRequestInvalidToken,
  PokemonBadRequestMissingID,
  PokemonBadRequestMissingCount,
  PokemonBadRequestImproperCount,
  PokemonBadRequestMissingAfter,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonImageNotFoundError,
  PokemonDuplicateError,
  PokemonNoSuchRouteError,
  PokemonAuthError,
};
