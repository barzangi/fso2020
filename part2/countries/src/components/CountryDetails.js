import React from 'react';

import Weather from './Weather';

const CountryDetails = ({ country }) => {
  return (
    <>
      <h1>{country.name}</h1>
      <div><strong>Capital:</strong> {country.capital}</div>
      <div><strong>Population:</strong> {country.population}</div>
      <h2>Languages</h2>
      <ul>
        {country.languages.map(language => {
          return <li key={language.iso639_2}>{language.name}</li>
        })}
      </ul>
      <img width='200' src={country.flag} alt={country.name} />
      <Weather capital={country.capital} />
    </>
  );
};

export default CountryDetails;