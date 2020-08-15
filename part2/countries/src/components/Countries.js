import React from 'react';

import Country from './Country';
import CountryDetails from './CountryDetails';

const Countries = ({ countries, filterText, filterHandler }) => {
  const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(filterText.toLowerCase()));

  if (!filterText) {
    return <p>Type some text in the box above</p>;
  } else if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (filteredCountries.length > 1) {
    return (
      <>
        <ul>
          {filteredCountries.map(country => <Country key={country.alpha3Code} name={country.name} filterHandler={filterHandler} />)}
        </ul>
      </>
    );
  } else if (filteredCountries.length === 1) {
    return (
      <CountryDetails country={filteredCountries[0]} />
    );
  } else {
    return <p>No matches found</p>;
  }
};

export default Countries;