import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity  } from 'react-native';
import * as Location from 'expo-location';
import { useLocation } from '../providers/LocationProvider';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/theme';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const LocationBanner = () => {
  const { location, error } = useLocation();
  const [address, setAddress] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (location) {
      (async () => {
        try {
          const addressArray = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          if (addressArray.length > 0) {
            const { city, region, country, street, district, subregion } = addressArray[0];
            
            let primaryLocation = '';
            
            if (street) {
              primaryLocation = street;
            } else if (district) {
              primaryLocation = district;
            } else if (city) {
              primaryLocation = city;
            } else if (subregion) {
              primaryLocation = subregion;
            }
            
            const locationText =
              primaryLocation
                ? `${primaryLocation}, ${region || country}`
                : region
                  ? `${region}, ${country}`
                  : country || 'Unknown location';

            setAddress(locationText);
          }
        } catch (error) {
          console.warn('Geocoding error:', error);
          Alert.alert('Error', 'Failed to fetch address.');
        }
      })();
    }
  }, [location]);

  if (error) return (
    <LinearGradient
      colors={[Colors.error || '#FF6B6B', Colors.errorDark || '#D63031']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.banner}
    >
      <Text style={styles.bannerText}>Location unavailable</Text>

      <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('../settings')}>
        <MaterialIcons name="settings" size={24} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );

  return (
    <View>
    <LinearGradient
      colors={[Colors.primary1,Colors.primary2, Colors.primary3]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.banner}
    >
      <Text style={styles.bannerText}>
        {address ? address : 'Fetching location...'}
      </Text>

      <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('../settings')}>
        <MaterialIcons name="settings" size={24} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    padding: 11,
    zIndex: 1,
    alignItems: 'center',
    color: 'white',
  },
  bannerText: { 
    fontSize: 20, 
    color: 'white',
    fontWeight: '500',
    fontFamily: 'Marker'
  },
  errorText: { 
    color: 'red', 
    fontSize: 16, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  settingsButton: {
    position: 'absolute',
    right: 15,
    top: '100%',
    transform: [{ translateY: -12 }],
  },
});

export default LocationBanner;