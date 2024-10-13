// src/components/DriverShare.js
import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../firebase';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

const DriverShare = () => {
  const [shareId, setShareId] = useState('');
  const [sharePass, setSharePass] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    let watchId;
    if (isSharing) {
      // Start watching the position in real-time
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Update location in Firebase every second
          const locationRef = ref(database, 'locations/' + shareId);
          set(locationRef, {
            latitude,
            longitude,
            sharePass
          });
        },
        (error) => {
          console.error('Error getting location: ', error);
          Alert.alert('Error getting location', error.message);
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
      );
    }

    // Cleanup: stop watching when component is unmounted or sharing stops
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isSharing, shareId, sharePass]);

  const handleStartShare = () => {
    if (!shareId || !sharePass || !secretKey) {
      Alert.alert('Please enter Share ID, Share Password, and Secret Key.');
      return;
    }

    // Verify secret key
    const correctSecretKey = 'nec@61';
    if (secretKey !== correctSecretKey) {
      Alert.alert('Invalid Secret Key. Please try again.');
      return;
    }

    // Start sharing location
    setIsSharing(true);
    Alert.alert('Location sharing started!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Your Location</Text>
      <TextInput
        style={styles.inputField}
        placeholder="Enter Share ID"
        value={shareId}
        onChangeText={setShareId}
      />
      <TextInput
        style={styles.inputField}
        placeholder="Enter Share Password"
        value={sharePass}
        onChangeText={setSharePass}
        secureTextEntry
      />
      <TextInput
        style={styles.inputField}
        placeholder="Enter Secret Key"
        value={secretKey}
        onChangeText={setSecretKey}
        secureTextEntry
      />
      <Button title="Start Sharing" onPress={handleStartShare} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  inputField: {
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
});

export default DriverShare;
