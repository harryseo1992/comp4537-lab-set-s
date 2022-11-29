import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "./Components/AdminDashboard/Login";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <h1>
      <Router>
        <Login />
      </Router>
    </h1>
  </React.StrictMode>
);
