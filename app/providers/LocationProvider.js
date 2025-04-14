import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const customLocationKey = "CUSTOM_LOCATION";
const LocationContext = createContext(null);

//London
const DEFAULT_LOCATION = {
  coords: {
    latitude: 51.5074,
    longitude: -0.1278
  },
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState('unknown');

  useEffect(() => {
    (async () => {
      try {
        const customLocation = await AsyncStorage.getItem(customLocationKey);
        if (customLocation) {
          const parsedLocation = JSON.parse(customLocation);
          setLocation({
            coords: {
              latitude: parsedLocation.latitude,
              longitude: parsedLocation.longitude
            },
          });
        } else {
          await requestLocationPermission();
        }
      } catch (err) {
        console.warn('Error during init:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const status = await requestLocationPermission();
      console.log("getting your location ",status);
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(currentLocation);
        await AsyncStorage.removeItem(customLocationKey);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Error getting current location:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      
      if (status === 'granted') {
        try {
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setLocation(currentLocation);
        } catch (err) {
          console.warn('Error getting location after permission granted:', err);
        }
      } else {
        Alert.alert(
          'Limited Functionality',
          'Some features require location permission. Default location will be used instead.',
          [{ text: 'OK' }]
        );
      }
      
      return status;
    } catch (err) {
      console.warn('Error requesting permission:', err);
      return 'error';
    }
  };

  const setCustomLocation = async (coords) => {
    if (!coords) return false;
    
    try {
      const newLocation = {
        coords: {
          latitude: coords.latitude,
          longitude: coords.longitude
        },
      };
      
      setLocation(newLocation);
      await AsyncStorage.setItem(customLocationKey, JSON.stringify(coords));
      return true;
    } catch (error) {
      console.error('Error setting custom location:', error);
      return false;
    }
  };

  const hasLocationPermission = () => {
    return permissionStatus === 'granted';
  };
 

  return (
    <LocationContext.Provider value={{ 
      location, 
      isLoading, 
      permissionStatus,
      defaultLocation: DEFAULT_LOCATION,
      getCurrentLocation,
      setCustomLocation,
      hasLocationPermission,
      requestLocationPermission
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};

export default LocationProvider;