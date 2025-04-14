import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const LOCATIONS_KEY = 'saved_locations';
const UPLOADS_KEY = 'uploaded_drawings';

const StorageContext = createContext(null);

export const useStorage = () => {
    const context = useContext(StorageContext);
    if (context === null) {
      throw new Error('useStorage is used outside of the StorageProvider');
    }
    return context;
  };


export const StorageProvider = ({ children }) => {
  const [savedLocations, setSavedLocations] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialised, setIsInitialised] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const [locationsData, uploadData] = await Promise.all([
          AsyncStorage.getItem(LOCATIONS_KEY),
          AsyncStorage.getItem(UPLOADS_KEY)
        ]);
        
        setSavedLocations(locationsData ? JSON.parse(locationsData) : []);
        setUploads(uploadData ? JSON.parse(uploadData) : []);

      } catch (error) {
        console.error('Error fetching data from storage:', error);
      } finally {
        setIsLoading(false);
        setIsInitialised(true); 
      }
    };

    loadData();
  }, []);


/// SAVED LOCATIONS FUNCTIONS ///

  const saveLocation = async (locationData) => {
    try {
      const exists = savedLocations.some(
        l => l.name.toLowerCase() === locationData.name.toLowerCase()
      );
      if (!exists) {
        const updatedLocations = [...savedLocations, locationData];
        await AsyncStorage.setItem(LOCATIONS_KEY, JSON.stringify(updatedLocations));
        setSavedLocations(updatedLocations);
        console.log('Saved- updated locations: ', updatedLocations);
        
      }
      return true;
    } catch (error) {
      console.error('Error saving location:', error);
      return false;
    }
  };

  const getSavedLocations = () => {
    return savedLocations;
  };

  const removeLocation = async (locationName) => {
    try {
      const updatedLocations = savedLocations.filter((l) => l.name !== locationName);

      await AsyncStorage.setItem(LOCATIONS_KEY, JSON.stringify(updatedLocations));
      setSavedLocations(updatedLocations);
      console.log('Removed- updated locations: ', updatedLocations);
      return true;
    } catch (error) {
      console.error('Error removing location:', error);
      return false;
    }
  };

/// SAVED UPLOAD FUNCTIONS ///

useEffect(() => {
  console.log("Storage provider state updated - uploads count:", uploads.length);
}, [uploads]);

  const saveUpload = async (uploadData) => {
    try {
      const existingUploads = await AsyncStorage.getItem(UPLOADS_KEY);
      const uploads = existingUploads ? JSON.parse(existingUploads) : [];

      const uploadId = Date.now().toString();
      
      const uploadWithId = { 
        id: uploadId,
        createdAt: new Date().toISOString(),
        ...uploadData 
      };
      
      const updatedUploads = [...uploads, uploadWithId];
      
      await AsyncStorage.setItem(UPLOADS_KEY, JSON.stringify(updatedUploads));
      setUploads(updatedUploads);
      
      console.log('Upload saved successfully with ID:', uploadId);
      return uploadId;

    } catch (error) {
      console.error('Error saving upload:', error);
      throw error;
    }
  };

  const getAllUploads = () => {
    if (!isInitialised) {
      console.warn('Warning: Accessing uploads before storage is initialized');
      return [];
    }
    return uploads;
  };

  const getUploadById = (id) => {
    return uploads.find(upload => upload.id === id) || null;
  };

  const updateUpload = async (id, updatedData) => {
    try {
      const index = uploads.findIndex(upload => upload.id === id);
      
      if (index !== -1) {
        const updatedUploads = [...uploads];
        updatedUploads[index] = { ...updatedUploads[index], ...updatedData };
        
        await AsyncStorage.setItem(UPLOADS_KEY, JSON.stringify(updatedUploads));
        setUploads(updatedUploads);
        
        console.log('Upload updated successfully:', id);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating upload:', error);
      throw error;
    }
  };

  const deleteUpload = async (id) => {
    try {
      const uploadToDelete = uploads.find(upload => upload.id === id);
      if (!uploadToDelete) return false;
  
      await Promise.all([
        uploadToDelete.artworkPhoto && FileSystem.deleteAsync(uploadToDelete.artworkPhoto),
        uploadToDelete.locationPhoto && FileSystem.deleteAsync(uploadToDelete.locationPhoto)
      ].filter(Boolean)); 
  
      const updatedUploads = uploads.filter(upload => upload.id !== id);
      await AsyncStorage.setItem(UPLOADS_KEY, JSON.stringify(updatedUploads));
      setUploads(updatedUploads);
      
      console.log('Upload and associated files deleted successfully:', id);
      return true;
    } catch (error) {
      console.error('Error deleting upload:', error);
      throw error;
    }
  };

  const clearAllData = async () => {
    try {
      await Promise.all(
        uploads.flatMap(upload => [
          upload.artworkPhoto && FileSystem.deleteAsync(upload.artworkPhoto),
          upload.locationPhoto && FileSystem.deleteAsync(upload.locationPhoto)
        ]).filter(Boolean)
      );
      
      await Promise.all([
        AsyncStorage.removeItem(LOCATIONS_KEY),
        AsyncStorage.removeItem(UPLOADS_KEY)
      ]);
      
      setSavedLocations([]);
      setUploads([]);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  };

  const value = {
    savedLocations,
    uploads,
    isLoading,
    isInitialised,
    
    // Location functions
    saveLocation,
    getSavedLocations,
    removeLocation,
    
    // Upload functions
    saveUpload,
    getAllUploads,
    getUploadById,
    updateUpload,
    deleteUpload,
    
    // Clear all
    clearAllData
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
};

