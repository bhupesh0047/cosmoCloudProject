import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, Dimensions, TouchableOpacity, ScrollView, Animated, PanResponder, Modal } from 'react-native';
import { Appbar } from 'react-native-paper';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

// Define types for location and route details
interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface RouteDetails {
  startPoint: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
}

const TravelSafetyApp = () => {
  const [currentPosition, setCurrentPosition] = useState<LocationCoords | null>(null);
  const [routeDetails, setRouteDetails] = useState<RouteDetails>({
    startPoint: '',
    destination: '',
    date: '',
    time: '',
    passengers: 1,
  });

  const [modalVisible, setModalVisible] = useState(false);

  const screenHeight = Dimensions.get('window').height;
  const initialPanelHeight = screenHeight * 0.20; // Yellow panel will take 20% of the screen initially
  const expandedPanelHeight = screenHeight; // Full screen height when expanded

  const animatedHeight = useRef(new Animated.Value(initialPanelHeight)).current; // Initial height of the yellow panel
  const [isExpanded, setIsExpanded] = useState(false); // State to track if the panel is expanded

  // PanResponder to handle drag up and down to expand/collapse the panel
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 20; // Detect a vertical swipe
      },
      onPanResponderMove: Animated.event([null, { dy: animatedHeight }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50) {
          expandPanel();
        } else if (gestureState.dy > 50) {
          collapsePanel();
        }
      },
    })
  ).current;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleChange = (name: string, value: string | number) => {
    setRouteDetails({ ...routeDetails, [name]: value });
  };

  const handleSubmit = () => {
    Alert.alert('Route Added', 'Route details have been added successfully.');
    console.log('Route Details:', routeDetails);
  };

  const handleSOS = () => {
    Alert.alert('SOS Alert', 'Your location has been sent to emergency contacts.');
  };

  const handleMenuPress = () => {
    setModalVisible(true);
  };

  const handleOptionSelect = (option: string) => {
    Alert.alert(option, `${option} selected!`);
    setModalVisible(false);
  };

  // Function to expand the yellow panel
  const expandPanel = () => {
    Animated.timing(animatedHeight, {
      toValue: expandedPanelHeight,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setIsExpanded(true));
  };

  // Function to collapse the yellow panel
  const collapsePanel = () => {
    Animated.timing(animatedHeight, {
      toValue: initialPanelHeight,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setIsExpanded(false));
  };

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title="SAFE STEPS" titleStyle={styles.appBarTitle} />
        <Appbar.Action icon="menu" onPress={handleMenuPress} />
      </Appbar.Header>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        {currentPosition ? (
          <MapView
            style={styles.map}
            region={{
              latitude: currentPosition.latitude,
              longitude: currentPosition.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={currentPosition} />
          </MapView>
        ) : (
          <Text>Loading map...</Text>
        )}
      </View>

      {/* Expandable Yellow Panel */}
      <Animated.View
        style={[styles.scrollablePanel, { height: animatedHeight }]}
        {...panResponder.panHandlers} // Attach pan handlers to this panel
      >
        {/* Arrow icon for expanding/collapsing at the top of the panel */}
        <TouchableOpacity onPress={isExpanded ? collapsePanel : expandPanel}>
          <View style={styles.arrowContainer}>
            <MaterialIcons
              name={isExpanded ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
              size={30}
              color="gray"
            />
          </View>
        </TouchableOpacity>

        {/* Content inside the yellow panel */}
        <ScrollView style={styles.scrollView}>
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Add a New Route</Text>
            <TextInput
              style={styles.input}
              placeholder="Starting Point"
              value={routeDetails.startPoint}
              onChangeText={(value) => handleChange('startPoint', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Destination"
              value={routeDetails.destination}
              onChangeText={(value) => handleChange('destination', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Date"
              value={routeDetails.date}
              onChangeText={(value) => handleChange('date', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Time"
              value={routeDetails.time}
              onChangeText={(value) => handleChange('time', value)}
            />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Passengers"
              value={String(routeDetails.passengers)}
              onChangeText={(value) => handleChange('passengers', Number(value))}
            />
            <Button title="Add Route" onPress={handleSubmit} color="#4CAF50" />
          </View>

          {/* SOS Button */}
          <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>

          {/* Options Section with Labels */}
          <View style={styles.optionsContainer}>
            {/* Safety Tips Icon */}
            <View style={styles.iconWithLabel}>
              <FontAwesome name="lightbulb-o" size={50} color="gold" onPress={() => Alert.alert('Safety Tips')} />
              <Text style={styles.iconLabel}>Safety Tips</Text>
            </View>

            {/* Alerts Icon */}
            <View style={styles.iconWithLabel}>
              <FontAwesome name="bell" size={50} color="green" onPress={() => Alert.alert('Alerts')} />
              <Text style={styles.iconLabel}>Alerts</Text>
            </View>

            {/* Route History Icon */}
            <View style={styles.iconWithLabel}>
              <FontAwesome name="history" size={50} color="orangered" onPress={() => Alert.alert('Route History')} />
              <Text style={styles.iconLabel}>History</Text>
            </View>

            {/* Current Location Icon */}
            <View style={styles.iconWithLabel}>
              <FontAwesome name="map-marker" size={50} color="blue" onPress={() => Alert.alert('Current Location')} />
              <Text style={styles.iconLabel}>Location</Text>
            </View>

            {/* Report Issue Icon */}
            <View style={styles.iconWithLabel}>
              <FontAwesome name="exclamation-triangle" size={50} color="yellowgreen" onPress={() => Alert.alert('Report Issue')} />
              <Text style={styles.iconLabel}>Report</Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View> 

      {/* Modal for Menu Options */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Options</Text>
            {['Profile', 'Sign up/in', 'notifications', 'Ratings', 'Reports', 'Log Out'].map(option => (
              <TouchableOpacity key={option} onPress={() => handleOptionSelect(option)}>
                <Text style={styles.modalOption}>{option}</Text>
              </TouchableOpacity>
            ))}
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgoldenrodyellow',
    alignItems: 'center',
  },
  appBar: {
    backgroundColor: '#FF7F7F',
    width: '100%',
  },
  appBarTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  mapContainer: {
    width: '100%',
    height: Dimensions.get('window').height * 0.55,
    backgroundColor: '#e0e0e0',
    marginTop: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollablePanel: {
    backgroundColor: 'lightgoldenrodyellow',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  arrowContainer: {
    alignItems: 'center',
    padding: 0,
    marginVertical: 5,
  },
  scrollView: {
    padding: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  sosButton: {
    backgroundColor: 'red',
    padding: 15,
    alignItems: 'center',
    margin: 10,
  },
  sosText: {
    color: 'white',
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
  },
  iconWithLabel: {
    alignItems: 'center',
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 12,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalOption: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default TravelSafetyApp;




