import React from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

const Page = ({tenPokemons}) => {
  // takes in 10 pokemons
  return tenPokemons.map(pokemon => {
    var pngNumValue;
    if (pokemon.id < 10) {
      pngNumValue = `00${pokemon.id}`
    }
    if (pokemon.id >= 10 && pokemon.id < 100) {
      pngNumValue = `0${pokemon.id}`;
    }
    if (pokemon.id >= 100) {
      pngNumValue = `${pokemon.id}`;
    }
    const pokemonImageUrl = `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${pngNumValue}.png`
    return(
      <>
        <Grid item xs={12} sm={4} sx={{padding: 5}}>
          <CardContent>
            <img src={pokemonImageUrl} height="150" width="150"/>
            <Typography variant="h5" component="div">
              {pokemon.id} : {pokemon.name.english}
            </Typography>
            <Typography color="text.secondary">
              Types: {pokemon.type.map((type) => {
                return (
                  <span>{type + " "}</span>
                );
              })}
            </Typography>
            <Typography variant="h8" component="div">
              {"HP: " + pokemon.base["HP"]}
            </Typography>
            <Typography variant="h8" component="div">
              {"Attack: " + pokemon.base["Attack"]}
            </Typography>
            <Typography variant="h8" component="div">
              {"Defense: " + pokemon.base["Defense"]}
            </Typography>
            <Typography variant="h8" component="div">
              {"Speed Attack: " + pokemon.base["Sp. Attack"]}
            </Typography>
            <Typography variant="h8" component="div">
              {"Speed Defense: " + pokemon.base["Sp. Defense"]}
            </Typography>
            <Typography variant="h8" component="div">
              {"Speed: " + pokemon.base["Speed"]}
            </Typography>
          </CardContent>
        </Grid>
      </>
    )
  });
}

export default Page;