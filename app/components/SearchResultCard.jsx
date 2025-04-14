import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/theme';


const SearchResultCard = ({ weather, onSave }) => {
  if (!weather) return null; 

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>
          {weather.location.name}, {weather.location.country}
        </Text>

        <Text style={styles.text}>{weather.current.temp_c}°C - {weather.current.condition.text}</Text>
        <Text style={styles.text}>Wind: {weather.current.wind_kph} kph</Text>
        <Text style={styles.text}>Humidity: {weather.current.humidity}%</Text>

        <Text style={styles.text}>Sunrise: {weather.forecast.forecastday[0].astro.sunrise}</Text>
        <Text style={styles.text}>Sunset: {weather.forecast.forecastday[0].astro.sunset}</Text>
      </View>

      <TouchableOpacity 
        onPress={() => onSave(
          weather.location.name,
          {
            latitude: weather.location.lat,
            longitude: weather.location.lon
          }
        )} 
        style={styles.addButton}
      >
        <MaterialIcons name="add" size={40} color="#cccccc" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: '100%',
    marginVertical: 10,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 3,
  },
  addButton: {
    backgroundColor: Colors.primary1,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SearchResultCard;
