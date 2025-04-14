import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function GalleryCard({ item, onPress }) {
  return (
    <View style={styles.drawingCard}>
      
      <TouchableOpacity 
        style={styles.imageContainer} 
        onPress={onPress}
        activeOpacity={0.9}
      >
        {item.artworkPhoto ? (
          <Image 
            source={{ uri: item.artworkPhoto }} 
            style={styles.squareImage} 
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.squareImage, styles.noImagePlaceholder]}>
            <MaterialIcons name="brush" size={40} color="#cccccc" />
            <Text style={styles.noImageText}>No artwork photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.descriptionSection}>
      <Text style={styles.drawingTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.locationRow}>
          <MaterialIcons name="location-on" size={14} color="#666666" />
          <Text style={styles.locationText} numberOfLines={1}>{item.location?.name || 'Unknown Location'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawingCard: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    flex: 1,
  },
  headerSection: {
    padding: 12,
    paddingBottom: 6,
  },
  drawingTitle: {
    fontSize: 16,
    fontFamily: 'Marker',
    flex: 1,
  },
  imageContainer: {
    width: '100%',
  },
  squareImage: {
    width: '100%',
    aspectRatio: 4/3,
  },
  noImagePlaceholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#999999',
    fontSize: 12,
    marginTop: 6,
  },
  descriptionSection: {
    padding: 10,
    paddingTop: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#666666',
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
});