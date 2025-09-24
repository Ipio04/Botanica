import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getWeather } from './services/weather';
import { getPlantsByHumidity } from './services/trefle';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const [weather, setWeather] = useState(null);
  const [plants, setPlants] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        return;
      }

      const coords = await Location.getCurrentPositionAsync({});
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
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('PlantDetail', { plant: item })}
          >
            {item.image_url && (
              <Image source={{ uri: item.image_url }} style={styles.thumb} />
            )}
            <Text>{item.common_name || item.scientific_name || 'Sin nombre'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function PlantDetailScreen({ route }) {
  const { plant } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{plant.common_name || plant.scientific_name}</Text>
      {plant.image_url && (
        <Image source={{ uri: plant.image_url }} style={styles.image} />
      )}
      <Text>Nombre científico: {plant.scientific_name}</Text>
      <Text>Familia: {plant.family_common_name || 'Desconocida'}</Text>
      <Text>Género: {plant.genus || 'Desconocido'}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
        <Stack.Screen name="PlantDetail" component={PlantDetailScreen} options={{ title: 'Detalle de Planta' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  thumb: { width: 50, height: 50, marginRight: 10, borderRadius: 5 },
  image: { width: '100%', height: 250, marginVertical: 20, borderRadius: 10 },
});
