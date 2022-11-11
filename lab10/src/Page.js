import React from 'react';

const Page = ({tenPokemons}) => {
  // takes in 10 pokemons
  return tenPokemons.map(pokemon => {
    return(
      <>
        <p>{pokemon.name.english} id is {pokemon.id}</p>
      </>
    )
  });
}

export default Page;