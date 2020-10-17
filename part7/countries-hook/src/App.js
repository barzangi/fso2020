import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange
  };
};

const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    const getCountry = async (name) => {
      try {
        const response = await axios.get(`https://restcountries.eu/rest/v2/name/${name}?fullText=true`);
        setCountry(response.data[0]);
      } catch (exception) {
        setCountry('not found');
      }
    };
    if (name) {
      getCountry(name);
    }
  }, [name]);

  return country;
};

const Country = ({ country }) => {
  if (!country) {
    return null;
  }

  if (country === 'not found') {
    return (
      <div>
        not found...
      </div>
    );
  }

  return (
    <div>
      <h3>{country.name} </h3>
      <div>Capital: {country.capital} </div>
      <div>Population: {country.population}</div>
      <br />
      <img border='1' src={country.flag} height='100' alt={`flag of ${country.name}`}/>  
    </div>
  );
};

const App = () => {
  const nameInput = useField('text');
  const [name, setName] = useState('');
  const country = useCountry(name);

  const fetch = (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  );
};

export default App;