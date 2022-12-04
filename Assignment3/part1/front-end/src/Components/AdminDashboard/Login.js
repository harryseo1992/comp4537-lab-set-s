import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import FilterablePokemon from "../FilterablePokemon/FilterablePokemon";
import { Link, Route, Routes } from "react-router-dom";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  useEffect(() => {
    const autoRegister = async () => {
      await axios({
        method: "POST",
        url: "http://localhost:6767/register",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          username: "admin1",
          password: "admin",
          email: "admin@gmail.com",
          role: "admin",
        }),
        validateStatus: (status) => {
          return true; // always returning true for now to check
        },
      })
        .catch((error) => {
          console.log(error);
        })
        .then((response) => {
          console.log(response);
          console.log("Admin created");
        });
    };
    autoRegister();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:6767/login",
        JSON.stringify({
          username: userName,
          password: passWord,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUser(res.data);
      setAccessToken(res.headers["auth-token-access"]);
      setRefreshToken(res.headers["auth-token-refresh"]);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {user?.username ? (
        <>
          <h1>Welcome {user.username}</h1>
          <Dashboard
            accessToken={accessToken}
            setAccessToken={setAccessToken}
            refreshToken={refreshToken}
          />
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <span> Admin Login </span>
            <br />
            <input
              type="text"
              placeholder="username"
              onChange={(e) => setUserName(e.target.value)}
            />
            <br />
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setPassWord(e.target.value)}
            />
            <br />
            <button type="submit">Login</button>
          </form>
          <div>
            <Link to="/pokedex">Link to pokedex for clients</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
