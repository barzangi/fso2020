import React, { useState, useEffect } from 'react';
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
  }, [capital]);

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

export default Weather;