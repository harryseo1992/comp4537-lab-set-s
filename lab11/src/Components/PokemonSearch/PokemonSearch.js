import React from "react";

const PokemonSearch = ({ searchQueries, setSearchQueries }) => {
  const searchByNameOnChangeFunctionHandle = (e) => {
    setSearchQueries({ ...searchQueries, searchByName: e.target.value });
  };

  const searchByTypeOnChangeFunctionHandle = (e) => {
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
    <>
      <input
        type="text"
        placeholder="Search.."
        onChange={searchByNameOnChangeFunctionHandle}
      />
      <br />
    </>
  );
};
