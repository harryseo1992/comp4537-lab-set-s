import React, { useState, useEffect } from 'react';
import Page from './Page.js';
import Pagination from './Pagination.js';
import axios from 'axios';

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonsPerPage] = useState(10);

  useEffect(()=> {
    const fetchPokemons = () => {
      axios('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json')
        .then(res => res.json())
        .then(data => setPokemons(data));
    }
    fetchPokemons();
  }, [])
}

