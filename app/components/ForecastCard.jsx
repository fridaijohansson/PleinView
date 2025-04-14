import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import Colors from '../constants/theme';

const { width } = Dimensions.get('window');

const getWeekday = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const ForecastCard = ({ forecastDays }) => {
  const renderForecastDay = (item, index) => (
    <View key={index} style={styles.slide}>
      <Text style={styles.date}>{getWeekday(item.date)}</Text>
      <Text style={styles.temp}>{item.day.avgtemp_c}°C</Text>
      <Text style={styles.condition}>{item.day.condition.text}</Text>

      <View style={styles.detailsContainer}>
        <View style={styles.column}>
          <Text style={styles.detail}>Wind: {item.day.maxwind_kph} kph</Text>
          <Text style={styles.detail}>Humidity: {item.day.avghumidity}%</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.detail}>Sunrise: {item.astro.sunrise}</Text>
          <Text style={styles.detail}>Sunset: {item.astro.sunset}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Swiper
      showsPagination={true}
      dotColor={Colors.mediumGrey}
      activeDotColor={Colors.lightGrey}
      paginationStyle={{ bottom: -10 }}
      loop={false}
      height={200}
    >
      {forecastDays.slice(0, 3).map(renderForecastDay)}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: width - 50,
    padding: 20,
    alignSelf: 'center',
    justifyContent:'center',
  },
  date: {
    fontSize: 20,
    textAlign: 'center',
    color: Colors.primary2,
    fontFamily:'Marker',
  },
  temp: {
    fontSize: 30,
    fontWeight: '600',
    marginVertical: 5,
    textAlign: 'center',
    color: Colors.primary3,
    fontFamily:'Marker'
  },
  condition: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: Colors.primary3,
    fontFamily:'Marker',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  column: {
    flexDirection: 'column',
  },
  detail: {
    fontSize: 14,
    marginVertical: 2,
    color: Colors.primary3,
  },
});

export default ForecastCard;
