import React from "react";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import FilterablePokemon from "./Components/FilterablePokemon/FilterablePokemon.js";

const App = () => {
  return (
    <>
      <Box>
        <Grid container>
          <FilterablePokemon />
        </Grid>
      </Box>
    </>
  );
};

export default App;
