class PokemonBadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = 'PokemonBadRequest';
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
    this.message = "Error - Bad request - improper count value: check the API doc";
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
    this.name = 'PokemonDuplicateError';
    this.message = "Error - PokemonDuplicateError: The Pokemons has already been inserted.";
    this.pokeErrCode = 400;
  }
}

class PokemonDbError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PokemonDbError';
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
    this.name = 'PokemonNoSuchRouteError';
    this.message = "Error - Improper Route: check the API doc";
    this.pokeErrCode = 404;
  }
}

module.exports = {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonBadRequestMissingCount,
  PokemonBadRequestImproperCount,
  PokemonBadRequestMissingAfter,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonImageNotFoundError,
  PokemonDuplicateError,
  PokemonNoSuchRouteError
}