import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchWeatherByCity } from '../services/WeatherService';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ForecastCard from './ForecastCard';

const MapCard = ({ location, onClose }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWeatherData = async () => {
      setLoading(true);
      try {
        const data = await fetchWeatherByCity(location.name);
        console.log(data);
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather for location:', error);
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      getWeatherData();
    }
  }, [location]);

  if (!location) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.locationName}>{location.name}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialCommunityIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <Text style={styles.loadingText}>Loading weather...</Text>
      ) : weatherData ? (
        
        <ForecastCard forecastDays={weatherData.forecast.forecastday} />
      ) : (
        <Text style={styles.errorText}>Unable to load weather data</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationName: {
    fontSize: 24,
    color: '#333',
    fontFamily:'Marker',
  },
  closeButton: {
    padding: 4,
  },
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  temperatureContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  condition: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
  },
});

export default MapCard;