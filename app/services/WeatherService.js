import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

export const fetchWeather = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: `${lat},${lon}`,
        days: 3,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

export const fetchWeatherByCity = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: city,
        days: 3,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching weather by city:', error);
    return null;
  }
};

export const fetchHourlyForecast = async (lat, lon, dateString) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: `${lat},${lon}`,
        dt: dateString,
        hour: 24 
      },
    });

    return response.data?.forecast?.forecastday[0]?.hour || [];
  } catch (error) {
    console.error('Error fetching hourly forecast:', error);
    return null;
  }
};


export const fetchHistoricalWeather = async (lat, lon, dateString) => {
  try {
    const response = await axios.get(`${BASE_URL}/history.json`, {
      params: {
        key: API_KEY,
        q: `${lat},${lon}`,
        dt: dateString, // "YYYY-MM-DD"
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching historical weather:', error);
    return null;
  }
};
