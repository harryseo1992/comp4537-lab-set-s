import React from 'react'

function City({ cityData }) {
  const { tempreture, name, description } = cityData;

  return (
    <div>
      <h4>
        {name} temp. is {tempreture}
      </h4>
      <p>
        {name} weather {description}
      </p>
      <hr />
    </div>
  )
}

export default City