import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useLocation } from '../../providers/LocationProvider';
import { useStorage } from '../../providers/StorageProvider';
import { fetchWeather, fetchWeatherByCity } from '../../services/WeatherService';
import SearchResultCard from '../../components/SearchResultCard';
import SavedLocationCard from '../../components/SavedLocationCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import LocationBanner from '../../components/LocationBanner';
import ForecastCard from '../../components/ForecastCard';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

export default function WeatherScreen() {
  const { location, error } = useLocation();
  const [userWeather, setUserWeather] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [hasLoadedWeather, setHasLoadedWeather] = useState(false);



  const { 
    saveLocation, 
    removeLocation,
    savedLocations 
  } = useStorage();

  useEffect(() => {
    if (location && !hasLoadedWeather) {
      loadUserWeather();
      setHasLoadedWeather(true);
    }
  }, [location, hasLoadedWeather]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setWeather(null);
    }
  }, [searchQuery]);

  const loadUserWeather = async () => {
    setLoading(true);
    const data = await fetchWeather(location.coords.latitude, location.coords.longitude);
    if (data) {
      setUserWeather(data);
    } else {
      Alert.alert('Error', 'Failed to load user location weather.');
    }
    setLoading(false);
  };


  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    const data = await fetchWeatherByCity(searchQuery);
    if (data) {
      setWeather(data);
    } else {
      Alert.alert('Error', 'Could not find location. Try again.');
    }
    setSearching(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setWeather(null);
  };

   const handleSaveLocation = async (locationName, coordinates) => {
    try {
      if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
        Alert.alert('Error', 'Location coordinates are missing');
        return;
      }
      const locationData = {
        name: locationName,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };
  
      const success = await saveLocation(locationData);

      console.log(locationData);
      
      if (success) {
        setWeather(null);
        setSearchQuery('');
        Alert.alert('Saved!', `${locationName} has been added to your saved locations.`);
      } else {
        Alert.alert('Notice', `${locationName} is already in your saved locations.`);
      }
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert('Error', 'Failed to save location. Please try again.');
    }
  };

  const handleDeleteLocation = async (locationName) => {
    try {
      const success = await removeLocation(locationName);
      if (success) {
        Alert.alert('Removed', `${locationName} has been removed from your saved locations.`);
      } else {
        Alert.alert('Error', 'Failed to remove location.');
      }
    } catch (error) {
      console.error('Error removing location:', error);
      Alert.alert('Error', 'Failed to remove location. Please try again.');
    }
  };

  if (error) return <View style={styles.error}><Text>{error}</Text></View>;
  if (loading) return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;

  

  return (
    <SafeAreaView style={styles.container}>
        <LocationBanner />
        
    <LinearGradient
      colors={[Colors.primary1,Colors.primary2, Colors.primary3]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.banner}
    >
  <View style={styles.weatherContainer}>
  {userWeather?.forecast?.forecastday?.length > 0 ? (
  <View style={{ height: 220, width: '100%' }}>
    <Swiper
      showsPagination={true}
      dotColor={Colors.lightGray}
      activeDotColor={Colors.primary1}
      paginationStyle={{ bottom: 0 }}
      loop={false}
    >
      {userWeather.forecast.forecastday.slice(0, 3).map((day, index) => {
        const weekday = new Date(day.date).toLocaleDateString('en-US', {
          weekday: 'long',
        });
        const { avgtemp_c, condition, maxwind_kph, avghumidity } = day.day;
        const { sunrise, sunset } = day.astro;

        return (
          <View
            key={index}
          >
            <Text style={{ fontSize: 20,paddingBottom:5,  textAlign: 'center', color:'white',fontFamily:'Marker', }}>
              {weekday}
            </Text>
            <Text style={styles.temperatureText}>
                {avgtemp_c}°C
              </Text>
              <Text style={styles.conditionText}>
                {condition.text}
              </Text>
              <View style={styles.weatherDetailsContainer}>
                <View style={styles.weatherDetailColumn}>
                  <Text style={styles.weatherText}> Wind: {maxwind_kph} kph</Text>
                  <Text style={styles.weatherText}> Humidity: {avghumidity}%</Text>
                </View>
                <View style={styles.weatherDetailColumn}>
                  <Text style={styles.astroText}>Sunrise: {sunrise}</Text>
                  <Text style={styles.astroText}> Sunset: {sunset}</Text>
                </View>
              </View>
          </View>
        );
      })}
    </Swiper>
  </View>
) : (
  <Text style={styles.weatherText}>Loading your location's weather...</Text>
)}
  </View>
</LinearGradient>
        <View style={styles.bottomView}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search Location"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.input}
            />
             <TouchableOpacity
                onPress={weather ? handleClearSearch : handleSearch}
                style={[
                  styles.searchButton,
                  weather && styles.clearButton
                ]}
              >
                <Ionicons name="search" size={20} color="white" />
              </TouchableOpacity>

          </View>

          {weather && <SearchResultCard weather={weather} onSave={handleSaveLocation} />}

          <FlatList
            style={styles.savedLocations}
            data={savedLocations}
            keyExtractor={(item) => item.name} 
            renderItem={({ item }) => (
              <SavedLocationCard 
                location={item}  
                onRemove={handleDeleteLocation} 
              />
            )}
            contentContainerStyle={{}}
          />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightGrey },
  title: { fontSize: 22, marginBottom: 10,  },
  text: { fontSize: 16, marginBottom: 5 },
  slide: {
    flex: 1,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  searchButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  searchButton: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 5,
    flex: 1,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
  },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { flex: 1, justifyContent: 'center', alignItems: 'center', color: 'red' },
  
 
  bottomView: {
    paddingTop:20,
    flex: 1,
    width:'100%',
  },
  savedLocations:{
    width:'100%',
  },
  searchView: {
    alignItems: 'center',
    width: '100%',
  },
  weatherContainer: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
    
  },
  weatherContent: {
    width: '100%',
    flexDirection: 'column',
  },
  temperatureText: {
    fontSize: 60, 
    fontFamily:'Marker',
    color:'white',
    marginBottom: 10,
    textAlign: 'center'
  },
  weatherDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding:20,
    
  },
  weatherDetailColumn: {
    flexDirection: 'column',
  },
  conditionText:{
    fontSize: 20,
    marginVertical: 3,
    color:'white',
    fontFamily:'Marker',
    textAlign: 'center'
  },
  weatherText: {
    fontSize: 14,
    marginVertical: 3,
    color:'white',
  },
  astroText: {
    fontSize: 14,
    color:'white',
    textAlign: 'right',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  input: {
    flex: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 10, 
  },
  
});

