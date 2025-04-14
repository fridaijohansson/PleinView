import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { LocationProvider } from './providers/LocationProvider';
import { StorageProvider } from './providers/StorageProvider';
import LoadingSplash from './components/SplashScreen';

ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Marker': require('../assets/fonts/James Stroker.ttf')
  });
  
  const [appReady, setAppReady] = useState(false);
  const [splashHidden, setSplashHidden] = useState(false);

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await ExpoSplashScreen.hideAsync();
        setAppReady(true);
      }
    }
    
    prepare();
  }, [fontsLoaded]);

  if (!appReady) {
    return null;
  }

  return (
    <StorageProvider>
      <LocationProvider>
        {!splashHidden && <LoadingSplash onFinish={() => setSplashHidden(true)} />}
        <Slot />
      </LocationProvider>
    </StorageProvider>
  );
}