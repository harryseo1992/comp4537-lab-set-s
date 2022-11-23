import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Slider } from "@mui/material";
import "./PokemonSearch.css";

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
    setSearchQueries({
      ...searchQueries,
      searchByHp: parseInt(e.target.value),
    });
  };

  const searchByAttackOnChangeFunctionHandle = (e) => {
    setSearchQueries({
      ...searchQueries,
      searchByAttack: parseInt(e.target.value),
    });
  };

  const searchByDefenseOnChangeFunctionHandle = (e) => {
    setSearchQueries({
      ...searchQueries,
      searchByDefense: parseInt(e.target.value),
    });
  };

  const searchBySpAttackOnChangeFunctionHandle = (e) => {
    setSearchQueries({
      ...searchQueries,
      searchBySpAttack: parseInt(e.target.value),
    });
  };

  const searchBySpDefenseOnChangeFunctionHandle = (e) => {
    setSearchQueries({
      ...searchQueries,
      searchBySpDefense: parseInt(e.target.value),
    });
  };

  const searchBySpeedOnChangeFunctionHandle = (e) => {
    setSearchQueries({
      ...searchQueries,
      searchBySpeed: parseInt(e.target.value),
    });
  };

  return (
    <>
      <div className="pokemonSearch">
        <input
          type="text"
          placeholder="Search.."
          maxLength={80}
          onChange={searchByNameOnChangeFunctionHandle}
        />
        <br />
        <FormControl sx={{ marginTop: 5, minWidth: 148 }}>
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
          <FormHelperText>Choose a type</FormHelperText>
        </FormControl>
      </div>
      <div className="pokeSliderOne">
        <h5>Pokemon HP</h5>
        <Slider
          key={1}
          aria-label="PokemonHP"
          defaultValue={0}
          valueLabelDisplay="auto"
          onChange={searchByHpOnChangeFunctionHandle}
          step={1}
          marks
          min={1}
          max={255}
        />
        <h5>Pokemon Attack</h5>
        <Slider
          key={2}
          aria-label="PokemonAttack"
          defaultValue={0}
          valueLabelDisplay="auto"
          onChange={searchByAttackOnChangeFunctionHandle}
          step={1}
          marks
          min={1}
          max={255}
        />
        <h5>Pokemon Defense</h5>
        <Slider
          key={3}
          aria-label="PokemonDefense"
          defaultValue={0}
          valueLabelDisplay="auto"
          onChange={searchByDefenseOnChangeFunctionHandle}
          step={1}
          marks
          min={1}
          max={255}
        />
      </div>
      <div className="pokeSliderTwo">
        <h5>Pokemon Speed Attack</h5>
        <Slider
          key={4}
          aria-label="PokemonSpAttack"
          defaultValue={0}
          valueLabelDisplay="auto"
          onChange={searchBySpAttackOnChangeFunctionHandle}
          step={1}
          marks
          min={1}
          max={255}
        />
        <h5>Pokemon Speed Defense</h5>
        <Slider
          key={5}
          aria-label="PokemonSpDefense"
          defaultValue={0}
          valueLabelDisplay="auto"
          onChange={searchBySpDefenseOnChangeFunctionHandle}
          step={1}
          marks
          min={1}
          max={255}
        />
        <h5>Pokemon Speed</h5>
        <Slider
          key={6}
          aria-label="PokemonSpeed"
          defaultValue={0}
          valueLabelDisplay="auto"
          onChange={searchBySpeedOnChangeFunctionHandle}
          step={1}
          marks
          min={1}
          max={255}
        />
      </div>
    </>
  );
};

export default PokemonSearch;
