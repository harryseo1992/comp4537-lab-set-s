import React, { useEffect, useState } from 'react'
import City from './City'
function Cities() {

  const [cities, setCities] = useState([])
  const url = "http://localhost:8080/cities"
  useEffect(() => {
    fetch(url)
      .then((resp) => { return resp.json() })
      .then((jsonedResp) => { setCities(jsonedResp)})
  }, [])

  return (
    <>
      Cities Component
      <hr />
      {
        cities.map((cityData) => {
        return <City cityData={cityData} />
        })
      }
    </>
  )
}

export default Cities