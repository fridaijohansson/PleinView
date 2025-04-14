import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, ActivityIndicator } from 'react-native';
import { useLocation } from '../providers/LocationProvider';

const LoadingSplash = ({ onFinish }) => {
  const { isLoading: locationLoading } = useLocation();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (!locationLoading) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }).start(() => {
        if (onFinish) onFinish();
      });
    }
  }, [locationLoading]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image
        source={require('../../assets/images/bg-splash.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>PleinView</Text>
      </View>
      
      <View style={styles.loaderContainer}>
        
        <Text style={styles.loadingText}>
          Finding your location...
        </Text>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  titleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 40
  },
  title: {
    fontFamily: 'Marker',
    fontSize: 40,
    color: 'white',
    textAlign: 'center'
  },
  loaderContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center'
  },
  loadingText: {
    fontFamily: 'Marker',
    fontSize: 20,
    color: 'white',
    marginTop: 15
  }
});

export default LoadingSplash;