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
  console.log(currentPokemons);
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
    searchQueries.searchByType == "" ? true : false;

  useEffect(() => {
    setFilteredPokemons(
      pokemons.filter((p) =>
        p.name.english.toLowerCase().includes(searchQueries.searchByName) &&
        forNotSpecifiedTypeSearch
          ? p.type
          : p.type.includes(searchQueries.searchByType)
      )
    );
  }, [
    pokemons,
    searchQueries.searchByName,
    searchQueries.searchByType,
    filteredPokemons,
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
