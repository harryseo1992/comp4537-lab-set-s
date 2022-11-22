import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import FilteredPokemonPage from "../FiteredPokemonPage/FilteredPokemonPage";

const FilterablePokemon = () => {
  const [pokemons, setPokemons] = useState([]);
  const [searchQueries, setSearchQueries] = useState({
    searchByName: "",
    searchByType: "",
    searchByHp: "0",
    searchByAttack: "0",
    searchByDefense: "0",
    searchBySpAttack: "0",
    searchBySpDefense: "0",
    searchBySpeed: "0",
  });

  useEffect(() => {
    const fetchPokemons = () => {
      axios
        .get(
          "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json"
        )
        .then((res) => res.data)
        .then((data) => setPokemons(data));
    };
    fetchPokemons();
  }, []);

  return (
    <>
      <FilteredPokemonPage
        pokemons={pokemons}
        searchQueries={searchQueries}
        setSearchQueries={setSearchQueries}
      />
    </>
  );
};

export default FilterablePokemon;
