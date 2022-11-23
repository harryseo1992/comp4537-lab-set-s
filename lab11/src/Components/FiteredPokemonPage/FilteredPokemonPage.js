import React, { useState, useEffect } from "react";
import Page from "../Page/Page";
import Pagination from "../Pagination/Pagination.js";
import { Grid } from "@mui/material";
import PokemonSearch from "../PokemonSearch/PokemonSearch.js";
import "./FilteredPokemonPage.css";
import { Box } from "@mui/system";

const FilteredPokemonPage = ({ pokemons, searchQueries, setSearchQueries }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonsPerPage] = useState(10);
  const [filteredPokemons, setFilteredPokemons] = useState(pokemons);

  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;

  const currentPokemons = filteredPokemons.slice(
    indexOfFirstPokemon,
    indexOfLastPokemon
  );
  const numberOfPagesForAllPokemons = Math.ceil(
    filteredPokemons.length / pokemonsPerPage
  );

  const getPokemonTypes = () => {
    var types = [];
    pokemons.forEach((pokemon) => {
      types = [...new Set([...types, ...pokemon.type])];
    });
    return types;
  };

  const forNotSpecifiedTypeSearch =
    searchQueries.searchByType === "" ? true : false;

  useEffect(() => {
    setFilteredPokemons(
      pokemons.filter(
        (pokemon) =>
          pokemon.name.english
            .toLowerCase()
            .includes(searchQueries.searchByName) &&
          (forNotSpecifiedTypeSearch
            ? pokemon.type
            : pokemon.type.includes(searchQueries.searchByType)) &&
          (searchQueries.searchByHp != null
            ? pokemon.base["HP"] >= searchQueries.searchByHp
            : pokemon.base["HP"]) &&
          (searchQueries.searchByAttack != null
            ? pokemon.base["Attack"] >= searchQueries.searchByAttack
            : pokemon.base["Attack"]) &&
          (searchQueries.searchByDefense != null
            ? pokemon.base["Defense"] >= searchQueries.searchByDefense
            : pokemon.base["Defense"]) &&
          (searchQueries.searchBySpAttack != null
            ? pokemon.base["Sp. Attack"] >= searchQueries.searchBySpAttack
            : pokemon.base["Sp. Attack"]) &&
          (searchQueries.searchBySpDefense != null
            ? pokemon.base["Sp. Defense"] >= searchQueries.searchBySpDefense
            : pokemon.base["Sp. Defense"]) &&
          (searchQueries.SearchBySpeed != null
            ? pokemon.base["Speed"] >= searchQueries.SearchBySpeed
            : pokemon.base["Speed"])
      )
    );
  }, [
    pokemons,
    searchQueries.searchByName,
    searchQueries.searchByType,
    searchQueries.searchByHp,
    searchQueries.searchByAttack,
    searchQueries.searchByDefense,
    searchQueries.searchBySpAttack,
    searchQueries.searchBySpDefense,
    searchQueries.SearchBySpeed,
    filteredPokemons,
    forNotSpecifiedTypeSearch,
  ]);

  return (
    <>
      <div className="searchBar">
        <PokemonSearch
          searchQueries={searchQueries}
          setSearchQueries={setSearchQueries}
          types={getPokemonTypes()}
        />
      </div>
      <Box>
        <Grid container className="pokemonGrid">
          <Page tenPokemons={currentPokemons} />
        </Grid>
      </Box>
      <Pagination
        className="pagination"
        numberOfPages={numberOfPagesForAllPokemons}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageLimit={10}
      />
    </>
  );
};

export default FilteredPokemonPage;
