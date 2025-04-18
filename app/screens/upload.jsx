import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Camera, CameraView} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useLocation } from '../providers/LocationProvider';
import { useStorage } from '../providers/StorageProvider';
import MapView, { Marker } from 'react-native-maps';
import { mapCustomStyle } from '../constants/customMapStyle';
import * as FileSystem from 'expo-file-system';
import Colors from '../constants/theme';
import DatePicker from '../components/DatePicker';
import { LinearGradient } from 'expo-linear-gradient';

export default function UploadScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditMode = !!id;
  const { location, error } = useLocation();
  const mapRef = useRef(null);
  const { saveUpload, getUploadById, updateUpload, deleteUpload } = useStorage();
  const cameraRef = useRef(null);
  const [cameraRatio, setCameraRatio] = useState('4:3');

  const [locationPhoto, setLocationPhoto] = useState(null);
  const [artworkPhoto, setArtworkPhoto] = useState(null);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [markerCoordinates, setMarkerCoordinates] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [mapExpanded, setMapExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [activeCameraType, setActiveCameraType] = useState(null); 
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const existingUpload = getUploadById(id);
      if (existingUpload) {
        setOriginalData(existingUpload);
        setTitle(existingUpload.title );
        setNotes(existingUpload.notes || "" );
        setLocationName(existingUpload.location?.name );
        
        if (existingUpload.sessionDateTime) {
          setSelectedDateTime(new Date(existingUpload.sessionDateTime));
        }
        
        
        if (existingUpload.location?.coords) {
          setMarkerCoordinates({
            latitude: existingUpload.location.coords.latitude,
            longitude: existingUpload.location.coords.longitude,
          });
        }
        
        if (existingUpload.locationPhoto) {
          setLocationPhoto({ uri: existingUpload.locationPhoto });
        }
        
        if (existingUpload.artworkPhoto) {
          setArtworkPhoto({ uri: existingUpload.artworkPhoto });
        }
      } else {
        Alert.alert("Error", "Artwork not found");
        router.back();
      }
    }
  }, [isEditMode, id]);

  useEffect(() => {
    (async () => {
      try {
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(cameraStatus.status === 'granted');
      } catch (err) {
        console.error('Error requesting camera permission:', err);
      }
  
      try {
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setGalleryPermission(galleryStatus.status === 'granted');
      } catch (err) {
        console.error('Error requesting gallery permission:', err);
      }
    })();
  }, []);

  useEffect(() => {
    if (location && !markerCoordinates && !isEditMode) {
      setMarkerCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  }, [location, isEditMode]);

  useEffect(() => {
    if (isEditMode && mapRef.current && markerCoordinates) {
      setTimeout(() => {
        mapRef.current.animateToRegion({
          latitude: markerCoordinates.latitude,
          longitude: markerCoordinates.longitude,
          latitudeDelta: 3,
          longitudeDelta: 3,
        }, 500); 
      }, 300);
    }
  }, [isEditMode, markerCoordinates]);

  const openCamera = (type) => {
    if (cameraPermission) {
      setActiveCameraType(type);
      setShowCamera(true);
    } else {
      Alert.alert("Permission Required", "Camera permission is required to take photos.");
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          skipProcessing: false,
          ratio: cameraRatio,
        });
        setShowCamera(false);
        
        if (activeCameraType === 'location') {
          setLocationPhoto({ uri: photo.uri });
        } else {
          setArtworkPhoto({ uri: photo.uri });
        }
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to capture image. Please try again.");
      }
    }
  };


  const pickFromGallery = async (type, aspectRatio = null) => {
    if (!galleryPermission) {
      Alert.alert("Permission Required", "Gallery permission is required to select photos.");
      return;
    }
  
    try {
      const options = {
        mediaTypes: ImagePicker.mediaTypes,
        quality: 0.8,
      };
      
      if (aspectRatio) {
        options.allowsEditing = true;
        options.aspect = aspectRatio;
      } else {
        options.allowsEditing = false;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync(options);
  
      if (!result.canceled) {
        if (type === 'location') {
          setLocationPhoto({ uri: result.assets[0].uri });
        } else {
          setArtworkPhoto({ uri: result.assets[0].uri });
        }
      }
    } catch (error) {
      console.error("Error picking image from gallery:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const showGalleryOptions = (type) => {
    Alert.alert(
      "Select Aspect Ratio",
      "Choose how you want to crop the image",
      [
        { 
          text: "Portrait (3:4)", 
          onPress: () => pickFromGallery(type, [3, 4]) 
        },
        { 
          text: "Landscape (4:3)", 
          onPress: () => pickFromGallery(type, [4, 3]) 
        },
        { 
          text: "Cancel", 
          style: "cancel" 
        }
      ]
    );
  };
  

  const showImageOptions = (type) => {
    Alert.alert(
      "Select Photo Source",
      "Choose where to get the photo from",
      [
        { text: "Camera", onPress: () => openCamera(type) },
        { text: "Gallery", onPress: () => showGalleryOptions(type) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const saveImageToFile = async (imageUri, type) => {
    if (isEditMode && imageUri.startsWith(FileSystem.documentDirectory)) {
      return imageUri;
    }
    
    try {
      const newFileName = generateUniqueFilename(imageUri, type === 'location' ? 'loc_' : 'art_');
      const newPath = `${FileSystem.documentDirectory}${newFileName}`;
      
      await FileSystem.copyAsync({
        from: imageUri,
        to: newPath
      });
      
      return newPath;
    } catch (error) {
      console.error("Error saving image:", error);
      throw error;
    }
  };

  const generateUniqueFilename = (uri, prefix = '') => {
    const ext = uri.split('.').pop();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${prefix}${timestamp}_${randomString}.${ext}`;
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert("Missing Information", "Please enter a title for your artwork.");
      return false;
    }
    
    if (!artworkPhoto) {
      Alert.alert("Missing Photo", "Please take a photo of your artwork.");
      return false;
    }
    
    if (!locationPhoto) {
      Alert.alert("Missing Photo", "Please take a location photo.");
      return false;
    }
    
    if (!locationName.trim()) {
      Alert.alert("Missing Information", "Please enter a location name.");
      return false;
    }
    
    if (!markerCoordinates) {
      Alert.alert("Missing Location", "Please select a location on the map.");
      return false;
    }

    const now = new Date();
    console.log(now, selectedDateTime)
    if (selectedDateTime > now) {
      Alert.alert("Invalid Date", "Please choose a date & time in the past.");
      return false;
    }
    
    return true;
  };

  const toggleMapSize = () => {
    setMapExpanded(prev => !prev);
  };

  const handleConfirmDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this artwork? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              setSaving(true);
              await deleteUpload(id);
              setSaving(false);
              Alert.alert(
                "Success",
                "Artwork deleted successfully.",
                [{ text: "OK", onPress: () => router.push('/') }]
              );
            } catch (error) {
              setSaving(false);
              console.error("Error deleting artwork:", error);
              Alert.alert("Error", "Failed to delete artwork. Please try again.");
            }
          }
        }
      ]
    );
  };

  const saveEntry = async () => {
    if (!validateForm()) return;
    
    try {
      setSaving(true);

      let artworkPhotoPath = null;
      if (artworkPhoto) {
        if (!artworkPhoto.uri.startsWith(FileSystem.documentDirectory) || !isEditMode) {
          artworkPhotoPath = await saveImageToFile(artworkPhoto.uri, 'artwork');
        } else {
          artworkPhotoPath = artworkPhoto.uri;
        }
      }
      
      let locationPhotoPath = null;
      if (locationPhoto) {
        if (!locationPhoto.uri.startsWith(FileSystem.documentDirectory) || !isEditMode) {
          locationPhotoPath = await saveImageToFile(locationPhoto.uri, 'location');
        } else {
          locationPhotoPath = locationPhoto.uri;
        }
      }
      
      const uploadData = {
        title,
        notes,
        sessionDateTime: selectedDateTime.toISOString(),
        artworkPhoto: artworkPhotoPath,
        locationPhoto: locationPhotoPath,
        location: {
          name: locationName || "",
          coords: {
            latitude: markerCoordinates.latitude,
            longitude: markerCoordinates.longitude,
          }
        }
      };
      
      if (isEditMode) {
        await updateUpload(id, uploadData);
        
        if (originalData) {
          if (originalData.artworkPhoto && originalData.artworkPhoto !== artworkPhotoPath) {
            try {
              await FileSystem.deleteAsync(originalData.artworkPhoto);
            } catch (error) {
              console.warn("Could not delete old artwork photo:", error);
            }
          }
          
          if (originalData.locationPhoto && originalData.locationPhoto !== locationPhotoPath) {
            try {
              await FileSystem.deleteAsync(originalData.locationPhoto);
            } catch (error) {
              console.warn("Could not delete old location photo:", error);
            }
          }
        }
        
        Alert.alert(
          "Success",
          "Your artwork has been updated successfully!",
          [{ text: "OK", onPress: () => router.push('/') }]
        );
      } else {
        const uploadId = await saveUpload(uploadData);
        
        Alert.alert(
          "Success",
          "Your artwork has been saved successfully!",
          [{ text: "OK", onPress: () => router.push('/') }]
        );
      }
      
      setSaving(false);
    } catch (error) {
      setSaving(false);
      console.error("Error saving artwork:", error);
      Alert.alert("Error", "Failed to save your artwork. Please try again.");
    }
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView 
        style={styles.camera} 
        ref={cameraRef}
        ratio={cameraRatio}
      >
        <View style={styles.cameraButtonsContainer}>
          <TouchableOpacity style={styles.cameraButton} onPress={() => setShowCamera(false)}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
            <Ionicons name="camera" size={40} color="white" />
          </TouchableOpacity>
          
        </View>
      </CameraView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[Colors.primary1, Colors.primary2, Colors.primary3]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.banner}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Edit Artwork' : 'Upload a Plein Air Artwork'}
        </Text>
        <View style={styles.headerSpacer} /> 
      </LinearGradient>

      <View style={styles.imageSection}>
        <View style={styles.photoContainer}>
        {locationPhoto ? (
            <TouchableOpacity onPress={() => showImageOptions('location')}>
              <Image 
                source={{ uri: typeof locationPhoto === 'string' ? locationPhoto : locationPhoto.uri }} 
                style={styles.photoPreview} 
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.photoPlaceholder} onPress={() => showImageOptions('location')}>
              <MaterialIcons name="add-a-photo" size={40} color="#007AFF" />
            </TouchableOpacity>
          )}
          <Text style={styles.label}>Location Photo*</Text>
        </View>

        <View style={styles.photoContainer}>
          {artworkPhoto ? (
            <TouchableOpacity onPress={() => showImageOptions('artwork')}>
              <Image source={{ uri: typeof artworkPhoto === 'string' ? artworkPhoto : artworkPhoto.uri }} 
              style={styles.photoPreview} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.photoPlaceholder} onPress={() => showImageOptions('artwork')}>
              <MaterialIcons name="add-a-photo" size={40} color="#007AFF" />
            </TouchableOpacity>
          )}
          <Text style={styles.label}>Artwork Photo*</Text>
        </View>
        </View>
      <View style={styles.mapHeaderContainer}>
        <Text style={styles.label}>Pin Location on Map{!isEditMode && '*'}</Text>
        <TouchableOpacity onPress={toggleMapSize} style={styles.expandButton}>
          <FontAwesome name={mapExpanded ? "compress" : "expand"} size={20} color="grey" />
        </TouchableOpacity>
      </View>
        
      <View style={mapExpanded ? styles.mapContainerExpanded : styles.mapContainer}>
        {(location || markerCoordinates) && (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: markerCoordinates?.latitude || location?.coords.latitude || 0,
              longitude: markerCoordinates?.longitude || location?.coords.longitude || 0,
              latitudeDelta: 2,
              longitudeDelta: 2,
            }}
            customMapStyle={mapCustomStyle}
            onPress={(e) => !isEditMode && setMarkerCoordinates(e.nativeEvent.coordinate)}
          >
            {markerCoordinates && (
              <Marker
                coordinate={markerCoordinates}
                draggable={!isEditMode}
                onDragEnd={(e) => !isEditMode && setMarkerCoordinates(e.nativeEvent.coordinate)}
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

      <View style={styles.formSection}>
        <Text style={styles.label}>Custom Location Name*</Text>
        <TextInput
          style={styles.input}
          value={locationName}
          onChangeText={setLocationName}
          placeholder="Enter location name"
        />

        {originalData ? (
        <TextInput
          value={new Date(originalData.sessionDateTime).toLocaleString()} 
          editable={false}
          style={{
            backgroundColor: '#f0f0f0',
            padding: 10,
            borderRadius: 5,
            color: '#888',
          }}
        />
      ) : (
        <DatePicker
          onDateTimeSelected={(dateTime) => {
            setSelectedDateTime(dateTime);
            console.log('Selected date/time:', dateTime);
          }}
        />
      )}

        <Text style={styles.label}>Title*</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title of artwork"
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.textArea}
          value={notes}
          onChangeText={setNotes}
          placeholder="Enter notes about the drawing, technique, materials, etc."
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.buttonRow}>
        {isEditMode ? (
          <TouchableOpacity 
            style={[styles.button, styles.deleteButton]} 
            onPress={handleConfirmDelete}
            disabled={saving}
          >
            <MaterialIcons name="delete" size={24} color="white" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={() => router.back()}
            disabled={saving}
          >
            <MaterialIcons name="cancel" size={24} color="#333" />
            <Text style={[styles.buttonText, { color: '#333' }]}>Cancel</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.button, styles.saveButton]} 
          onPress={saveEntry}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <MaterialIcons name={isEditMode ? "update" : "send"} size={24} color="white" />
              <Text style={styles.buttonText}>{isEditMode ? 'Update' : 'Save'}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  helpText:{
    fontSize:10,
    color:'lightgrey',
    textAlign:'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  imageSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
  },
  photoContainer: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },
  photoPlaceholder: {
    height: 150,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  placeholderText: {
    marginTop: 5,
    color: '#white',
  },
  photoPreview: {
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  formSection: {
    marginBottom: 20,
    padding:10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    height: 100,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
  },
  mapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  expandButton: {
    padding: 8,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    marginHorizontal: 10,
  },
  mapContainerExpanded: {
    height: 350,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    marginHorizontal: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  button: {
    width: '48%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    flexDirection: 'row',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: Colors.primary1,
  },
  deleteButton: {
    backgroundColor: '#A9A9A9', // Dark grey
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraButtonsContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginTop: 'auto',
    marginBottom: 30,
  },
  cameraButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 30,
    padding: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  headerSpacer: {
    width: 24, 
  },
  ratioButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    padding: 15,
  },
  ratioButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});