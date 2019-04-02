import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { Constants, Location, Permissions, MapView, PROVIDER_GOOGLE } from 'expo';

export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
    address: null,
  };

  componentWillMount() {
    // if (Platform.OS === 'android' && !Constants.isDevice) {
    //   this.setState({
    //     errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
    //   });
    // } else {
    // }
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    const { latitude, longitude } = location.coords
    const address = await Location.reverseGeocodeAsync({ latitude, longitude })
    this.setState({ location, address });
  };

  render() {
    let text = 'Waiting..';
    let addr = ""
    let loc = null
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
      addr = JSON.stringify(this.state.address)
      loc = this.state.location.coords
    }

    return (
      <View style={styles.container}>
        {/* <Text style={styles.paragraph}>{text}</Text> */}
        {
          this.state.location &&
          <MapView
          provider={PROVIDER_GOOGLE}
            customMapStyle={require("./map-style.json")}
            style={{ flex: 1, height: "125%" }}
            initialRegion={{
              latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          // showsUserLocation={true}
          >
          <MapView.Marker coordinate={loc}/>
          </MapView>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {

    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});