import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, ActivityIndicator, Modal, TouchableWithoutFeedback, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, Image, ScrollView } from 'react-native';
import { useStorage } from '../../providers/StorageProvider';
import { useRouter } from 'expo-router';
import FloatingButton from '../../components/FloatingButton';
import GalleryCard from '../../components/GalleryCard';
import LocationBanner from '../../components/LocationBanner';
import Colors from '../../constants/theme';

const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 36) / 2;

export default function DrawingsList() {
  const router = useRouter();
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [showLocationPhoto, setShowLocationPhoto] = useState(false);
  
  const { getAllUploads, deleteUpload } = useStorage();

  useEffect(() => {
    loadDrawings();
  }, []);

  const loadDrawings = async () => {
    try {
      setLoading(true);
      const data = await getAllUploads();
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setDrawings(sortedData);
    } catch (error) {
      console.error('Error loading drawings:', error);
      Alert.alert('Error', 'Failed to load your drawings.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDrawings();
  };

  const handleDeleteDrawing = (id) => {
    Alert.alert(
      'Delete Drawing',
      'Are you sure you want to delete this drawing? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUpload(id);
              if (selectedDrawing && selectedDrawing.id === id) {
                setModalVisible(false);
              }
              loadDrawings();
            } catch (error) {
              console.error('Error deleting drawing:', error);
              Alert.alert('Error', 'Failed to delete the drawing.');
            }
          },
        },
      ]
    );
  };

  const openDrawingDetail = (drawing) => {
    setShowLocationPhoto(false);
    
    const index = drawings.findIndex(item => item.id === drawing.id);
    setSelectedIndex(index);
    setSelectedDrawing(drawing);
    setModalVisible(true);
  };

  const handleEditDrawing = () => {
    if (selectedDrawing) {
      setModalVisible(false);
      router.push(`../upload?id=${selectedDrawing.id}`);
    }
  };

  const togglePhoto = () => {
    setShowLocationPhoto(!showLocationPhoto);
  };

  const goToNextDrawing = () => {
    if (selectedIndex < drawings.length - 1) {
      const nextIndex = selectedIndex + 1;
      setSelectedIndex(nextIndex);
      setSelectedDrawing(drawings[nextIndex]);
      setShowLocationPhoto(false); 
    }
  };

  const goToPreviousDrawing = () => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1;
      setSelectedIndex(prevIndex);
      setSelectedDrawing(drawings[prevIndex]);
      setShowLocationPhoto(false); 
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <GalleryCard 
        item={item}
        onPress={() => openDrawingDetail(item)}
      />
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LocationBanner/>
      
      {drawings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="brush" size={60} color="#cccccc" />
          <Text style={styles.emptyText}>No drawings yet</Text>
          <Text style={styles.emptySubtext}>
            Your saved drawings will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={drawings}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  

                  <View style={styles.modalActions}>
                    <TouchableOpacity style={styles.modalButton}
                      onPress={handleEditDrawing}
                    >
                      <MaterialIcons name="edit" size={24} color="#fff" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.modalButton}
                      onPress={() => selectedDrawing && handleDeleteDrawing(selectedDrawing.id)}
                    >
                      <MaterialIcons name="delete" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableWithoutFeedback  onPress={() => setModalVisible(false)}>
                    <MaterialIcons name="close" size={30} color="#fff" style={styles.modalButton}/>
                  </TouchableWithoutFeedback>
                </View>
                
                
                <ScrollView>
                
                  
                  <TouchableOpacity 
                    style={styles.imageContainer} 
                    onPress={togglePhoto}
                    activeOpacity={0.9}
                  >
                    {showLocationPhoto ? (
                      selectedDrawing?.locationPhoto ? (
                        <Image 
                          source={{ uri: selectedDrawing.locationPhoto }} 
                          style={styles.modalImage} 
                          resizeMode="contain"
                        />
                      ) : (
                        <View style={[styles.modalImage, styles.noImagePlaceholder]}>
                          <MaterialIcons name="location-on" size={40} color="#cccccc" />
                          <Text style={styles.noImageText}>No location photo</Text>
                        </View>
                      )
                    ) : (
                      selectedDrawing?.artworkPhoto ? (
                        <Image 
                          source={{ uri: selectedDrawing.artworkPhoto }} 
                          style={styles.modalImage} 
                          resizeMode="contain"
                        />
                      ) : (
                        <View style={[styles.modalImage, styles.noImagePlaceholder]}>
                          <MaterialIcons name="brush" size={40} color="#cccccc" />
                          <Text style={styles.noImageText}>No artwork photo</Text>
                        </View>
                      )
                    )}

                    
                    
                    <View style={styles.photoTypeIndicator}>
                      <MaterialIcons 
                        name={showLocationPhoto ? "location-on" : "brush"} 
                        size={16} 
                        color="#ffffff" 
                      />
                      <Text style={styles.photoTypeText}>
                        {showLocationPhoto ? "Location" : "Artwork"}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.navigationControls}>
                  
                    <TouchableOpacity 
                      style={[styles.navButton, selectedIndex === 0 ? styles.navButtonDisabled : null]}
                      onPress={goToPreviousDrawing}
                      disabled={selectedIndex === 0}
                    >
                      <MaterialIcons 
                        name="chevron-left" 
                        size={24} 
                        color={selectedIndex === 0 ? "#cccccc" : "#007AFF"} 
                      />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>
                      {selectedDrawing?.title}
                  </Text>
                    
                    <TouchableOpacity 
                      style={[styles.navButton, selectedIndex === drawings.length - 1 ? styles.navButtonDisabled : null]}
                      onPress={goToNextDrawing}
                      disabled={selectedIndex === drawings.length - 1}
                    >
                      <MaterialIcons 
                        name="chevron-right" 
                        size={24} 
                        color={selectedIndex === drawings.length - 1 ? "#cccccc" : "#007AFF"} 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  
                  <View style={styles.modalDetails}>
                    
                    <View style={styles.detailRow}>
                      <MaterialIcons name="location-on" size={16} color="#666666" />
                      <Text style={styles.detailText}>
                        {selectedDrawing?.location?.name || 'Unknown Location'}
                      </Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <MaterialIcons name="event" size={16} color="#666666" />
                      <Text style={styles.detailText}>
                        {selectedDrawing?.sessionDateTime ? new Date(selectedDrawing.sessionDateTime).toLocaleDateString() : ''}
                      </Text>
                    </View>
                    
                    {selectedDrawing?.notes && (
                      <View style={styles.notesContainer}>
                        <Text style={styles.notesLabel}>Notes:</Text>
                        <Text style={styles.notesText}>{selectedDrawing.notes}</Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
                
                
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      
      <FloatingButton/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 12,
    paddingBottom: 80,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  itemContainer: {
    width: itemWidth,
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
    flex: 1,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333333',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    maxHeight: '90%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:Colors.mediumGrey,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign:'center'
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  navButton: {
    padding: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navInfo: {
    fontSize: 14,
    color: '#666',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    backgroundColor:'black',
  },
  modalImage: {
    width: '100%',
    height: 300,
  },
  photoTypeIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  photoTypeText: {
    color: '#ffffff',
    fontSize: 10,
    marginLeft: 3,
  },
  modalDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  notesContainer: {
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    paddingLeft:10
  },
  modalButton: {
    padding: 10,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
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
});