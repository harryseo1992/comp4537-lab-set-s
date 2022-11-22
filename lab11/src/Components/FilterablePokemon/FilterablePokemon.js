import React, { useState, useEffect } from "react";
import axios from "axios";
import FilteredPokemonPage from "../FiteredPokemonPage/FilteredPokemonPage";

const FilterablePokemon = () => {
  const [pokemons, setPokemons] = useState([]);
  const [searchQueries, setSearchQueries] = useState({
    searchByName: "",
    searchByType: "",
    searchByHp: null,
    searchByAttack: null,
    searchByDefense: null,
    searchBySpAttack: null,
    searchBySpDefense: null,
    searchBySpeed: null,
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
