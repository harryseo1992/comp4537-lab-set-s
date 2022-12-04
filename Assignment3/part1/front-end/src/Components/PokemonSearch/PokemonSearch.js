import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./PokemonSearch.css";

const PokemonSearch = ({ searchQueries, setSearchQueries, types }) => {
  const [searchType, setSearchType] = useState([]);

  const searchByNameOnChangeFunctionHandle = (e) => {
    setSearchQueries({ ...searchQueries, searchByName: e.target.value });
  };

  const searchByTypeOnChangeFunctionHandle = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    if (checked) {
      setSearchType([...searchType, value]);
      setSearchQueries({
        ...searchQueries,
        searchByType: [...searchType, value],
      });
    } else {
      setSearchType(searchType.filter((e) => e !== value));
      setSearchQueries({
        ...searchQueries,
        searchByType: searchType.filter((e) => e !== value),
      });
    }
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
        {types.map((type) => {
          return (
            <div>
              <input
                type="checkbox"
                value={type}
                name="PokemonType"
                onChange={searchByTypeOnChangeFunctionHandle}
              />
              <label>{type}</label>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PokemonSearch;
