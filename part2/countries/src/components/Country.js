import React from 'react';

const Country = ({ name, filterHandler }) => {
  const eventObj = {
    target: {
      value: name
    }
  };
  return (
    <li>{name} <button onClick={() => filterHandler(eventObj)}>show</button></li>
  );
};

export default Country;