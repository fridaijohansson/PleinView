import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DatePicker({ onDateTimeSelected }) {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  
  const [displayDate, setDisplayDate] = useState('');
  const [displayTime, setDisplayTime] = useState('');
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    updateDisplayValues();
    
    if (onDateTimeSelected) {
      const dateToPass = new Date(selectedDateTime.getTime());
      onDateTimeSelected(dateToPass);
    }
  }, [selectedDateTime]);
  
  useEffect(() => {
    updateDisplayValues();
  }, []);

  const updateDisplayValues = () => {
    setDisplayDate(selectedDateTime.toLocaleDateString());
    setDisplayTime(
      selectedDateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    );
  };

  const onDateChange = (event, newDate) => {
    setShowDatePicker(false);
    
    if (event.type === 'dismissed' || !newDate) {
      return;
    }
    
    const updatedDateTime = new Date(selectedDateTime);
    updatedDateTime.setFullYear(newDate.getFullYear());
    updatedDateTime.setMonth(newDate.getMonth());
    updatedDateTime.setDate(newDate.getDate());
    
    setSelectedDateTime(updatedDateTime);
    
    if (Platform.OS === 'android') {
      setTimeout(() => setShowTimePicker(true), 100);
    }
  };

  const onTimeChange = (event, newTime) => {
    setShowTimePicker(false);
    
    if (event.type === 'dismissed' || !newTime) {
      return;
    }
    
    const updatedDateTime = new Date(selectedDateTime);
    updatedDateTime.setHours(newTime.getHours());
    updatedDateTime.setMinutes(newTime.getMinutes());
    
    setSelectedDateTime(updatedDateTime);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  return (
    <View>
      <Text style={styles.label}>Select Date & Time</Text>
      <View style={styles.dateRow}>
        <TouchableOpacity
          onPress={showDatepicker}
          style={styles.dateInput}
        >
          <Text>{displayDate}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={showTimepicker}
          style={styles.timeInput}
        >
          <Text>{displayTime}</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={selectedDateTime}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={selectedDateTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginRight: 5,
    flex: 1,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    width: 100,
  }
});