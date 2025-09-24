import axios from 'axios';
const API_KEY = 'ECYNn1a-06pCxFDVxN1PZ3TpLkoOT7M5LuXNOAbDQxg';
const BASE_URL = 'https://trefle.io/api/v1';

export const getPlantsByHumidity = async (minHumidity, maxHumidity) => {
  try {
    const response = await axios.get(`${BASE_URL}/plants`, {
      params: { token: API_KEY, filter: `min_humidity>=${minHumidity},max_humidity<=${maxHumidity}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error plantas:', error);
    return [];
  }
};

export const getPlantsByMonth = async (month) => {
  try {
    const response = await axios.get(`${BASE_URL}/plants`, {
      params: { token: API_KEY, filter: `flowering_months=${month}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error plantas por mes:', error);
    return [];
  }
};
