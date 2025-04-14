import { Tabs } from 'expo-router';
import { Image, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/theme.js';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.mediumGrey,
        tabBarInactiveTintColor: Colors.white,
        tabBarShowLabel: false, 
        tabBarBackground: () => (
          <LinearGradient
            colors={[Colors.primary1,Colors.primary2, Colors.primary3]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        ),
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          height: 60, 
        },
        
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => (
            <View style={{ paddingTop: 20 }}> 
              <Image
                source={require('../../../assets/images/world.png')}
                style={{ width: 60, height: 60, tintColor: color }}
              />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color }) => (
            <View style={{ paddingTop: 20 }}>
              <Image
                source={require('../../../assets/images/gallery.png')}
                style={{ width: 40, height: 40, tintColor: color }}
              />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: 'Weather',
          tabBarIcon: ({ color}) => (
            <View style={{ paddingTop: 20 }}>
              <Image
                source={require('../../../assets/images/weather.png')}
                style={{ width: 40, height: 40, tintColor: color }}
              />
            </View>
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}