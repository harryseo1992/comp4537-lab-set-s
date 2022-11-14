import React, { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import Page from './Page.js';
import Pagination from './Components/Pagination/Pagination.js';
import axios from 'axios';
import { Grid } from '@mui/material';

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonsPerPage] = useState(10);

  useEffect(()=> {
    const fetchPokemons = () => {
      axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json')
        .then(res => res.data)
        .then(data => setPokemons(data));
    }
    fetchPokemons();
  }, [])

  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;

  const currentPokemons = pokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);
  console.log(currentPokemons);
  const numberOfPagesForAllPokemons = Math.ceil(pokemons.length / pokemonsPerPage);

  return (
    <>
      <Box>
        <Grid container>
          <Page
            tenPokemons={currentPokemons}
          />
        </Grid>
      </Box>
      <Pagination
          numberOfPages={numberOfPagesForAllPokemons}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageLimit={10}
        />
    </>
  );
}

export default App;