import React, { useState, useEffect} from 'react';
import axios from 'axios';

const api_key = process.env.REACT_APP_WEATHER_API_KEY;

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${capital}`)
      .then(response => {
        setWeather(response.data);
      });
  }, []);

  if (!weather) return null;
  return (
    <>
      <h2>Weather in {capital}</h2>
      <img src={weather.current.weather_icons[0]} alt={weather.current.weather_descriptions} />
      <div><strong>Temperature:</strong> {weather.current.temperature} Celcius</div>
      <div><strong>Wind Speed:</strong> {weather.current.wind_speed} mph, <strong>Direction:</strong> {weather.current.wind_dir}</div>
    </>
  );
};

const Filter = ({ filterText, filterHandler }) => {
  return (
    <>
      <div>Find countries <input type='text' onChange={filterHandler} value={filterText} /></div>
    </>
  );
};

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

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data);
      });
  }, []);

  const filterHandler = (event) => {
    setFilterText(event.target.value);
  };

  return (
    <>
      <Filter filterText={filterText} filterHandler={filterHandler} />
      <Countries countries={countries} filterText={filterText} filterHandler={filterHandler} />
    </>
  );
};

export default App;