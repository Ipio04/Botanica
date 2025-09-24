import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import * as Location from 'expo-location';
import { getWeather } from './services/weather';
import { getPlantsByHumidity, getPlantsByMonth } from './services/trefle';

export default function App() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [plants, setPlants] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // Obtener ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        return;
      }

      const coords = await Location.getCurrentPositionAsync({});
      setLocation(coords.coords);

      // Obtener clima
      const clima = await getWeather(coords.coords.latitude, coords.coords.longitude);
      setWeather(clima);

      if (clima) {
        const hum = clima.main.humidity;
        const data = await getPlantsByHumidity(hum - 20, hum + 20);
        setPlants(data);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clima y Plantas</Text>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : weather ? (
        <Text>Temperatura: {weather.main.temp}°C, Humedad: {weather.main.humidity}%</Text>
      ) : (
        <Text>Cargando clima...</Text>
      )}

      <FlatList
        data={plants}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.image_url && (
              <Image
                source={{ uri: item.image_url }}
                style={{ width: 50, height: 50, marginRight: 10 }}
              />
            )}
            <Text>{item.common_name || item.scientific_name || 'Sin nombre'}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});
