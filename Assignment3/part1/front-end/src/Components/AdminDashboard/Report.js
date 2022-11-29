import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

const Report = ({ id, accessToken, setAccessToken, refreshToken }) => {
  const [reportTable, setReportTable] = useState("");
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
        setReportTable(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    start();
  }, [id, accessToken]);

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

  return (
    <>
      <div>Report {id && id}</div>
      <div> {reportTable && reportTable}</div>
    </>
  );
};

export default Report;
