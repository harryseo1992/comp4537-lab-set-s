import React from "react";
import Report from "./Report";

import { Routes, Route, Link } from "react-router-dom";

function Dashboard({ accessToken, setAccessToken, refreshToken }) {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link to="/report/1">
              Report 1 - Unique API users over a period of time
            </Link>
          </li>
          <li>
            <Link to="/report/2">
              Report 2 - Top API users over period of time
            </Link>
          </li>
          <li>
            <Link to="/report/3">Report 3 - Top users for each Endpoint</Link>
          </li>
          <li>
            <Link to="/report/4">Report 4 - 4xx Errors By Endpoint</Link>
          </li>
          <li>
            <Link to="/report/5">Report 5 - Recent 4xx/5xx Errors</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route
          path="/report/1"
          element={
            <Report
              id={1}
              accessToken={accessToken}
              setAccessToken={setAccessToken}
              refreshToken={refreshToken}
            />
          }
        />
        <Route
          path="/report/2"
          element={
            <Report
              id={2}
              accessToken={accessToken}
              setAccessToken={setAccessToken}
              refreshToken={refreshToken}
            />
          }
        />
        <Route
          path="/report/3"
          element={
            <Report
              id={3}
              accessToken={accessToken}
              setAccessToken={setAccessToken}
              refreshToken={refreshToken}
            />
          }
        />
        <Route
          path="/report/4"
          element={
            <Report
              id={4}
              accessToken={accessToken}
              setAccessToken={setAccessToken}
              refreshToken={refreshToken}
            />
          }
        />
        <Route
          path="/report/5"
          element={
            <Report
              id={5}
              accessToken={accessToken}
              setAccessToken={setAccessToken}
              refreshToken={refreshToken}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default Dashboard;
