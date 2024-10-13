import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DriverShare from '../components/DriverShare';
import UserTrack from '../components/UserTrack';
import { View, Button, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the types for navigation
type RootStackParamList = {
  Home: undefined;
  DriverShare: undefined;
  UserTrack: undefined;
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Bus Tracker App</Text>
      <Button
        title="Go to Driver Share"
        onPress={() => navigation.navigate('DriverShare')}
      />
      <Button
        title="Go to User Track"
        onPress={() => navigation.navigate('UserTrack')}
        style={styles.button}
      />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DriverShare" component={DriverShare} />
        <Stack.Screen name="UserTrack" component={UserTrack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});
