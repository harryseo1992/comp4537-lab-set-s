import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/system";
import Page from "./Components/Page/Page.js";
import Pagination from "./Components/Pagination/Pagination.js";
import { Grid } from "@mui/material";

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [searchByName, setSearchByName] = useState("");
  const [searchByType, setSearchByType] = useState("");
  const [searchByHp, setSearchByHp] = useState(0);
  const [searchByAttack, setSearchByAttack] = useState(0);
  const [searchBySpeed, setSearchBySpeed] = useState(0);
  const [searchByDefense, setSearchByDefense] = useState(0);
  const [searchBySpAttack, setSearchBySpAttack] = useState(0);
  const [searchBySpDefense, setSearchBySpDefense] = useState(0);
  const [filteredPokemons, setFilteredPokemons] = useState(pokemons);
  const handleChange = (e) => {
    setSearchByName(e.target.value);
  };
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
    setFilteredPokemons(pokemons.filter());
  }, []);

  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;

  const currentPokemons = pokemons.slice(
    indexOfFirstPokemon,
    indexOfLastPokemon
  );
  console.log(currentPokemons);
  const numberOfPagesForFilteredPokemons = Math.ceil(
    filteredPokemons.length / pokemonsPerPage
  );

  return (
    <>
      <Box>
        <Grid container>
          <form>
            <input type="search" value={searchByName} onChange={handleChange} />
          </form>
          <Page tenPokemons={currentPokemons} />
        </Grid>
      </Box>
      <Pagination
        numberOfPages={numberOfPagesForFilteredPokemons}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageLimit={10}
      />
    </>
  );
};

export default App;
