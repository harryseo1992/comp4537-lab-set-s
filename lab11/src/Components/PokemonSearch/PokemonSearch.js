import React, { useState } from "react";
// import Select from "react-select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const PokemonSearch = ({ searchQueries, setSearchQueries, types }) => {
  const [type, setType] = useState("");

  const searchByNameOnChangeFunctionHandle = (e) => {
    setSearchQueries({ ...searchQueries, searchByName: e.target.value });
  };

  const searchByTypeOnChangeFunctionHandle = (e) => {
    setType(e.target.value);
    setSearchQueries({ ...searchQueries, searchByType: e.target.value });
  };

  const searchByHpOnChangeFunctionHandle = (e) => {
    setSearchQueries({ ...searchQueries, searchByHp: e.target.value });
  };

  const searchByAttackOnChangeFunctionHandle = (e) => {
    setSearchQueries({ ...searchQueries, searchByAttack: e.target.value });
  };

  const searchByDefenseOnChangeFunctionHandle = (e) => {
    setSearchQueries({ ...searchQueries, searchByDefense: e.target.value });
  };

  const searchBySpAttackOnChangeFunctionHandle = (e) => {
    setSearchQueries({ ...searchQueries, searchBySpAttack: e.target.value });
  };

  const searchBySpDefenseOnChangeFunctionHandle = (e) => {
    setSearchQueries({ ...searchQueries, searchBySpDefense: e.target.value });
  };

  const searchBySpeedOnChangeFunctionHandle = (e) => {
    setSearchQueries({ ...searchQueries, searchBySpeed: e.target.value });
  };

  return (
    <div className="pokemonSearch">
      <input
        type="text"
        placeholder="Search.."
        onChange={searchByNameOnChangeFunctionHandle}
      />
      <br />
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-helper-label">
          Pokemon Type
        </InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={type}
          label="Pokemon Type"
          onChange={searchByTypeOnChangeFunctionHandle}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {types.map((type) => {
            return <MenuItem value={type}>{type}</MenuItem>;
          })}
        </Select>
        <FormHelperText>Choose a type you want to filter</FormHelperText>
      </FormControl>
    </div>
  );
};

export default PokemonSearch;
