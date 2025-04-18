import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert,ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import { useLocation } from '../providers/LocationProvider';
import Colors from '../constants/theme';
import { mapCustomStyle } from '../constants/customMapStyle';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SettingsScreen = () => {
  const { 
    location, 
    permissionStatus, 
    defaultLocation,
    getCurrentLocation,
    setCustomLocation,
    requestLocationPermission,
    isLoading: providerIsLoading  
  } = useLocation();

  const router = useRouter();
  
  const [mapExpanded, setMapExpanded] = useState(false);
  const [markerCoordinates, setMarkerCoordinates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const mapRef = useRef(null);

  useEffect(() => {
    if (location) {
      setMarkerCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    }
  }, [location]);

  useEffect(() => {
    setIsLoading(providerIsLoading);
  }, [providerIsLoading]);

  const toggleMapSize = () => {
    setMapExpanded(!mapExpanded);
    
    setTimeout(() => {
      if (markerCoordinates && mapRef.current) {
        mapRef.current.animateToRegion({
          ...markerCoordinates,
          latitudeDelta: 10,
          longitudeDelta: 10
        }, 500);
      }
    }, 100);
  };

  const handlePermissionRequest = async () => {
    const status = await requestLocationPermission();
    if (status === 'granted') {
      Alert.alert('Success', 'Location permission granted!');
    }
  };

  const saveCustomLocation = async () => {
    if (!markerCoordinates) {
      Alert.alert('Error', 'Please select a location on the map first.');
      return;
    }
    const success = await setCustomLocation(markerCoordinates);
    
    if (success) {
      Alert.alert('Success', 'Custom location saved successfully!');
    } else {
      Alert.alert('Error', 'Failed to save custom location.');
    }
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.primary1, Colors.primary2, Colors.primary3]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.banner}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('./(tabs)/map')}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Location Settings</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Permission</Text>
          <Text style={styles.status}>
            Status: <Text style={styles.statusValue}>
              {permissionStatus === 'granted' 
                ? 'Granted' 
                : permissionStatus === 'denied'
                  ? 'Denied'
                  : 'Not determined'}
            </Text>
          </Text>
          
          {permissionStatus !== 'granted' && (
            <TouchableOpacity style={styles.button} onPress={handlePermissionRequest}>
              <Text style={styles.buttonText}>Enable Location Access</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Default Location</Text>
          
          <View style={styles.mapHeaderContainer}>
            <Text style={styles.label}>Pin Location on Map</Text>
            <TouchableOpacity onPress={toggleMapSize} style={styles.expandButton}>
              <FontAwesome name={mapExpanded ? "compress" : "expand"} size={20} color="grey" />
            </TouchableOpacity>
          </View>
          
          <View style={mapExpanded ? styles.mapContainerExpanded : styles.mapContainer}>
            {(location || defaultLocation || markerCoordinates) && (
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                  latitude: markerCoordinates?.latitude || 
                    (location?.coords.latitude || defaultLocation.coords.latitude),
                  longitude: markerCoordinates?.longitude || 
                    (location?.coords.longitude || defaultLocation.coords.longitude),
                  latitudeDelta: 10,
                  longitudeDelta: 10,
                }}
                customMapStyle={mapCustomStyle}
                onPress={(e) => setMarkerCoordinates(e.nativeEvent.coordinate)}
              >
                {markerCoordinates && (
                  <Marker
                    coordinate={markerCoordinates}
                    draggable
                    onDragEnd={(e) => setMarkerCoordinates(e.nativeEvent.coordinate)}
                  >
                      <Image 
                        source={require('../../assets/images/marker.png')} 
                        style={{ width: 30, height: 30 }} 
                    />
                  </Marker>
                )}
              </MapView>
            )}
          </View>
          
          {markerCoordinates && (
            <View style={styles.coordinatesContainer}>
              <Text style={styles.coordinates}>
                Lat: {markerCoordinates.latitude.toFixed(6)}
              </Text>
              <Text style={styles.coordinates}>
                Lon: {markerCoordinates.longitude.toFixed(6)}
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]} 
            onPress={saveCustomLocation}
          >
            <Text style={styles.buttonText}>Save Custom Location</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={getCurrentLocation} 
            style={[styles.button, permissionStatus !== 'granted' && { backgroundColor: '#ccc' }]} 
            disabled={isLoading || permissionStatus !== 'granted'}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.buttonText}>Getting Location...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>
                {permissionStatus !== 'granted' ? 'Permission Required' : 'Get Current Location'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  banner:{
    flexDirection: 'row',
    marginBottom:20,
    padding: 10,
    paddingTop:15
  },
  backButton: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    flexDirection: 'row',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  status: {
    fontSize: 16,
    marginBottom: 16,
  },
  statusValue: {
    fontWeight: '600',
  },
  button: {
    backgroundColor: Colors.primary1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 8,
  },
  saveButton: {
    backgroundColor: Colors.primary1,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
  },
  mapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  expandButton: {
    padding: 8,
  },
  mapContainer: {
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mapContainerExpanded: {
    height: 400,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  coordinates: {
    fontSize: 14,
    color: '#666',
  },
});

export default SettingsScreen;