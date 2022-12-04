import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { BarChart } from "./BarChart";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";

const Report = ({ id, accessToken, setAccessToken, refreshToken }) => {
  const [chartData, setChartData] = useState([]);
  const [chartDataSet, setChartDataSet] = useState({
    labels: "No data yet",
    datasets: [
      {
        label: "Endpoint accessed",
        data: null,
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  const refreshAccessToken = async () => {
    try {
      const res = await axios.post(
        "http://localhost:6767/requestNewAccessToken",
        {},
        {
          headers: {
            "auth-token-refresh": refreshToken,
          },
        }
      );
      // setAccessToken(res.headers["auth-token-access"]);
      return res.headers["auth-token-access"];
    } catch (error) {
      console.log(error);
    }
  };

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt_decode(accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const newAccessToken = await refreshAccessToken();
        config.headers["auth-token-access"] = newAccessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const start = async () => {
      try {
        const res = await axiosJWT.get(
          `http://localhost:6969/report?id=${id}`,
          {
            headers: {
              "auth-token-access": accessToken,
            },
          }
        );
        if (id == 1 && res.data) {
          setChartDataSet({
            labels: res.data.map((data) => data.date),
            datasets: [
              {
                label: "Number of Users",
                data: res.data.map((data) => data.count),
                backgroundColor: [
                  "rgba(75,192,192,1)",
                  "#ecf0f1",
                  "#50AF95",
                  "#f3ba2f",
                  "#2a71d0",
                ],
                borderColor: "black",
                borderWidth: 2,
              },
            ],
          });
        }
        if (id == 2 && res.data) {
          setChartDataSet({
            labels: res.data.map((data) => data._id[1].username),
            datasets: [
              {
                label: "Number of Users",
                data: res.data.map((data) => data.count),
                backgroundColor: [
                  "rgba(75,192,192,1)",
                  "#ecf0f1",
                  "#50AF95",
                  "#f3ba2f",
                  "#2a71d0",
                ],
                borderColor: "black",
                borderWidth: 2,
              },
            ],
          });
        }
        if (id == 3 && res.data) {
          setChartDataSet({
            labels: res.data.map((data) => data._id),
            datasets: [
              {
                label: "Number of calls made by users",
                data: res.data.map((data) => data.count),
                backgroundColor: [
                  "rgba(75,192,192,1)",
                  "#ecf0f1",
                  "#50AF95",
                  "#f3ba2f",
                  "#2a71d0",
                ],
                borderColor: "black",
                borderWidth: 2,
              },
            ],
          });
        }
        if (id == 4 && res.data) {
          setChartDataSet({
            labels: res.data.map((data) => data._id.endpoint),
            datasets: [
              {
                label: "Number of calls made by users",
                data: res.data.map((data) => data.count),
                backgroundColor: [
                  "rgba(75,192,192,1)",
                  "#ecf0f1",
                  "#50AF95",
                  "#f3ba2f",
                  "#2a71d0",
                ],
                borderColor: "black",
                borderWidth: 2,
              },
            ],
          });
        }
        if (id == 5 && res.data) {
          setChartDataSet({
            labels: res.data.map((data) => data._id.endpoint),
            datasets: [
              {
                label: "Number of calls made by users",
                data: res.data.map((data) => data.count),
                backgroundColor: [
                  "rgba(75,192,192,1)",
                  "#ecf0f1",
                  "#50AF95",
                  "#f3ba2f",
                  "#2a71d0",
                ],
                borderColor: "black",
                borderWidth: 2,
              },
            ],
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    start();
  }, [id, accessToken]);

  return (
    <>
      <div>Report {id && id}</div>
      <BarChart chartDataSet={chartDataSet} />
    </>
  );
};

export default Report;
