// src/components/UserTrack.js
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

const UserTrack = () => {
  const [shareId, setShareId] = useState('');
  const [sharePass, setSharePass] = useState('');
  const [location, setLocation] = useState(null);
  const [path, setPath] = useState([]); // Path of bus locations

  const handleTrack = () => {
    const locationRef = ref(database, 'locations/' + shareId);

    // Track location in real-time from Firebase
    onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.sharePass === sharePass) {
        const newLocation = { latitude: data.latitude, longitude: data.longitude };
        setLocation(newLocation);
        setPath((prevPath) => [...prevPath, newLocation]); // Add new location to the path array
      } else {
        Alert.alert('Invalid ID or Password');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Bus Location</Text>
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
      <Button title="Track" onPress={handleTrack} />

      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* Polyline for route */}
          <Polyline coordinates={path} strokeColor="#FF0000" strokeWidth={3} />

          {/* Marker for the bus (real-time location) */}
          <Marker coordinate={location} title="Bus" />

          {/* Marker for destination */}
          <Marker coordinate={{ latitude: 9.1467, longitude: 77.83215 }} title="Destination" />
        </MapView>
      )}
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
  map: {
    width: '100%',
    height: 400,
    marginTop: 20,
  },
});

export default UserTrack;
