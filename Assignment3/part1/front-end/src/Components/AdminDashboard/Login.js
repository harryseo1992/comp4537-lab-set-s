import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [user, setUser] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:6001/login", {
        userName,
        passWord,
      });
      setUser(res.data);
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
          <Dashboard />
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <span> Admin Login </span>
          <br />
          <input
            type="text"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default Login;
