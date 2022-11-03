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

class PokemonDbError extends Error {
  constructor(message) {
    super(message);
    this.name = "PokemonDbError";
  }
}

class PokemonNotFoundError extends PokemonBadRequest {
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

module.exports = {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonBadRequestMissingCount,
  PokemonBadRequestImproperCount,
  PokemonBadRequestMissingAfter,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonImageNotFoundError
}