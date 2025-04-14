import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { fetchWeatherByCity } from '../services/WeatherService';
import Colors from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import ForecastCard from './ForecastCard';


const SavedLocationCard = ({ location, onRemove }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);

  const handleExpand = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setLoading(true);
    const data = await fetchWeatherByCity(location.name);
    setWeather(data);
    setLoading(false);
    setExpanded(true);
  };

  

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handleExpand} style={styles.header}>
        <Text style={styles.title}>{location.name}</Text>
        <TouchableOpacity onPress={() => onRemove(location.name)} style={styles.removeButton}>
        <Ionicons name="trash" size={24} color="Colors.primary3" />
        </TouchableOpacity>
      </TouchableOpacity>
  
      {expanded && (
        <View style={styles.details}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : weather ? (
            <ForecastCard forecastDays={weather.forecast.forecastday} />
          ) : (
            <Text style={styles.errorText}>Error loading weather</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: Colors.lightGrey,
    width:'100%',
    borderTopColor: 'rgba(0, 0, 0, 0.01)',
    borderTopWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    
  },
  title: {
    fontSize: 25,
    color: Colors.primary3,
    fontFamily: 'Marker'
  },
  removeButton: {
    padding: 5,
  },
  removeText: {
    fontSize: 16,
  },
  details: {
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    color: 'white',
  },
  temperatureText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  weatherDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  weatherDetailColumn: {
    flexDirection: 'column',
  },
  weatherText: {
    fontSize: 16,
    marginVertical: 3,
  },
  conditionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  astroText: {
    fontSize: 14,
    textAlign: 'right',
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SavedLocationCard;
