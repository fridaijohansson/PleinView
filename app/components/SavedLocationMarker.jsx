import { View, Image, Text } from 'react-native';
import { Marker } from 'react-native-maps';
import React from 'react';

const SavedLocationMarker = React.memo(({ location, onPress }) => {
  return (
    <Marker
      coordinate={{
        latitude: location.latitude,
        longitude: location.longitude,
      }}
      tracksViewChanges={false}
      onPress={onPress}
    >
    <Image
        source={require('../../assets/images/favorite.png')}
        style={styles.markerImage}
    />
    </Marker>
  );
});

const styles = {
  markerContainer: {
    alignItems: 'center',
  },
  markerImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  markerText: {
    fontWeight: 'bold',
    backgroundColor: 'white',
    paddingHorizontal: 4,
    borderRadius: 4,
    marginTop: 4,
  },
};

export default SavedLocationMarker;