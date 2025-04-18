import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Image, Dimensions, FlatList, ImageBackground } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocation } from '../../providers/LocationProvider';
import LocationBanner from '../../components/LocationBanner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mapCustomStyle } from '../../constants/customMapStyle';
import FloatingButton from '../../components/FloatingButton';
import { useStorage } from '../../providers/StorageProvider';
import MapCard from '../../components/MapCard';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/theme';
import ForecastCard from '../../components/ForecastCard';

export default function MapScreen() {
  const { location } = useLocation();
  const { savedLocations, getAllUploads, clearAllData, uploads} = useStorage();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [displayUploads, setDisplayUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    setLoadingError(null);
    loadUploads(); 
    //clearAllData()
  }, [savedLocations.length], [uploads.length]);

  useEffect(() => {
    console.log("Display uploads updated - count:", displayUploads.length);
  }, [displayUploads]);

  const loadUploads = async () => {
    console.log("Starting to load uploads...");
    try {
      setIsLoading(true);
      setLoadingError(null);

      
      const allUploads = await getAllUploads();
      console.log("Raw data from getAllUploads:", allUploads);
    

      setDisplayUploads(allUploads);
    } catch (error) {
      console.error("CRITICAL ERROR in loadUploads:", error);
      setLoadingError("Failed to load uploads. Please try again.");
      setStorageStatus("Error loading uploads");
    } finally {
      setIsLoading(false);
    }
  };

 
    

  const handleMarkerPress = (item) => {
    if (item.id) {
      setSelectedUpload(item);
      setSelectedLocation(null);
    } else {
      setSelectedLocation(item);
      setSelectedUpload(null);
    }
  };

  const handleCloseCardLocations = () => {
    setSelectedLocation(null);
  };

  const handleCloseCard  = () => {
    setSelectedUpload(null);
  };


  if (!location) return <ActivityIndicator size="large" color="#ffffff" style={styles.loading} />;

  return (
    <SafeAreaView style={styles.container}>
      <LocationBanner />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 90,
          longitudeDelta: 90,
        }}
        showsUserLocation
        customMapStyle={mapCustomStyle}
        ref={mapRef}
      >
        {savedLocations.map((loc) => (
          <Marker
            key={`${loc.name}-${loc.latitude}-${loc.longitude}`}
            coordinate={{
              latitude: loc.latitude,
              longitude: loc.longitude,
            }}
            description={loc.name}
            onPress={() => handleMarkerPress(loc)}
          >
            <Image 
              source={require('../../../assets/images/favorite.png')}
              style={{ height: 35, width: 35 }} 
            />
          </Marker>
        ))}
        
        
  {displayUploads.map((upload) => (
    <Marker
      key={upload.id}
      coordinate={{
        latitude: upload.location?.coords?.latitude || 0,
        longitude: upload.location?.coords?.longitude || 0,
      }}
      onPress={() => {
        setSelectedUpload(upload);
        if (upload.location?.coords) {
          mapRef.current?.animateToRegion({
            latitude: upload.location.coords.latitude,
            longitude: upload.location.coords.longitude,
            latitudeDelta: 3,
            longitudeDelta: 3,
          });
        }
      }}
    >
      <Image 
        source={require('../../../assets/images/drawing.png')}
        style={{ height: 35, width: 35 }} 
      />
    </Marker>
  ))}
      </MapView>
      
      {selectedLocation && (
        <MapCard 
          location={selectedLocation} 
          onClose={handleCloseCardLocations} 
        />
      )}

{selectedUpload && (
  <View style={styles.galleryOverlay}>
    <View
      style={styles.banner}
    >
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={displayUploads}
        keyExtractor={(item) => item.id}
        initialScrollIndex={displayUploads.findIndex(item => item.id === selectedUpload.id)}
        getItemLayout={(data, index) => ({
          length: Dimensions.get('window').width,
          offset: Dimensions.get('window').width * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={styles.galleryItem}>
            <View style={styles.overlayContent}>
                <Text style={styles.detailText}>
                  <Ionicons name="location" size={14} color="Colors.primary3" /> {item.location.name}
                  {"\t\t"}{item.sessionDateTime ? new Date(item.sessionDateTime).toLocaleDateString() : ''}
                </Text>
                <MaterialIcons
                  name="close"
                  size={20}
                  color="white"
                  onPress={handleCloseCard}
                  style={styles.closeButtonOnImage}
                />
              </View>
            <ImageBackground
              source={{ uri: item.artworkPhoto }}
              style={styles.galleryImageBackground}
              imageStyle={styles.galleryImage}
            >
              
            </ImageBackground>
          </View>
        )}
        onScroll={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window').width);
          if (displayUploads[index]?.location?.coords) {
            mapRef.current?.animateToRegion({
              latitude: displayUploads[index].location.coords.latitude,
              longitude: displayUploads[index].location.coords.longitude,
              latitudeDelta: 2,
              longitudeDelta: 2,
            });
          }
        }}
      />
    </View>
  </View>
)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    flex: 1,
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerContainer: {
    backgroundColor: 'white',
    padding: 8,
    paddingBottom: 24,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    width: 100,
  },
  
  galleryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingBottom: 16,
    maxHeight: '40%',
  },
  galleryImageBackground: {
    width: '100%',
    height: 220,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  overlayContent: {
    padding: 4,
    backgroundColor: Colors.lightGrey,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButtonOnImage: {
    padding: 6,
    color: Colors.primary3,
  },
  
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  detailText: {
    marginLeft: 6,
    fontSize: 16,
    color: Colors.primary3,
    fontFamily: 'Marker',
  },
  galleryItem: {
    width: Dimensions.get('window').width - 32,
    marginHorizontal: 16,
    
  },
});