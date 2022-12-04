import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/AdminDashboard/Login";
import FilterablePokemon from "./Components/FilterablePokemon/FilterablePokemon";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <h1>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/pokedex" element={<FilterablePokemon />} />
        </Routes>
      </Router>
    </h1>
  </React.StrictMode>
);
