import axios from 'axios';
const API_KEY = '3c8a08d1e17c1e4c7a59cca588b71435';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeather = async (lat, lon) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error clima:', error);
    return null;
  }
};
