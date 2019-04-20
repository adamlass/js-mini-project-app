import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, TouchableHighlight, Image, KeyboardAvoidingView, Keyboard, AsyncStorage } from 'react-native';
import { Constants, Location, Permissions, MapView, PROVIDER_GOOGLE, Notifications } from 'expo';
import LoginPanel from "./LoginPanel"
import { duration } from 'moment';


export default class App extends Component {
    state = {
        location: null,
        errorMessage: null,
        address: null,
        reset: false,
        loginDetails: {},
        friends: [],
        notification: null,
        lastNoti: null
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
        if (status !== "granted") {
            this.setState({
                errorMessage: "Permission to access location was denied"
            });
        }
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== "granted") {
            return;
        }

        let location = await Location.getCurrentPositionAsync({
            enableHighAccuracy: true
        });

        const { latitude, longitude } = location.coords;

        this._notificationSubscription = Notifications.addListener(
            this._handleNotification
        );
        this.setState({ location });
    };

    _handleNotification = async notification => {
        const msg = notification.data;
        console.log(msg)
        this.setState({ notification: msg });

    };

    reset = () => {
        console.log("reset")
        Keyboard.dismiss()
        this.setState({ reset: true })
    }

    setResetToFalse = async () => {
        await this.setState({ reset: false })
    }

    newFriends = (friends) => {
        this.setState({ friends })
    }

    componentDidUpdate() {
        if (this.state.notification) {
            
            var { latitude, longitude } = this.state.notification
            var region = {
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
            this.map.animateToRegion(region, 2000)
            this.setState({ lastNoti: this.state.notification, notification: null, friends: [] })

        }
    }


    render() {
        var friendMarkers = []
        if (this.state.friends) {
            this.state.friends.map(friend => {
                let { latitude, longitude, userName } = friend
                let loc = { latitude, longitude }
                friendMarkers.push(
                    <MapView.Marker key={userName} title={userName} coordinate={loc} />
                )
            })
        }

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                {/* <Text style={styles.paragraph}>{text}</Text> */}

                <View
                    style={{ flex: 1 }}
                    onTouchStart={this.reset}
                >
                    {
                        this.state.location ?
                            <MapView
                                ref={map => this.map = map}
                                provider={MapView.PROVIDER_GOOGLE}
                                customMapStyle={require("./map-style.json")}
                                showsMyLocationButton={true}
                                style={{ flex: 1, height: "125%" }}
                                initialRegion={{
                                    latitude: this.state.location.coords.latitude,
                                    longitude: this.state.location.coords.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                                showsUserLocation={true}
                            >
                                {friendMarkers}
                                {
                                    this.state.lastNoti &&
                                    <MapView.Marker
                                        coordinate={{
                                          latitude: this.state.lastNoti.latitude,
                                          longitude: this.state.lastNoti.longitude,
                                        }}
                                        title={this.state.lastNoti.userName}
                                        pinColor="dodgerblue"
                                    />
                                }

                            </MapView>
                            :
                            <View style={styles.container2}>
                                <Image
                                    style={
                                        {
                                            width: 200,
                                            height: 200
                                        }
                                    }
                                    source={require("./assets/loading-2.gif")}
                                />
                            </View>

                    }
                </View>

                <LoginPanel
                    reset={this.state.reset}
                    resetReset={this.setResetToFalse}
                    handleLogin={this.handleLogin}
                    newFriends={this.newFriends}
                />

            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        backgroundColor: '#ecf0f1',
    },
    container2: {

        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(17,17,17)',
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        textAlign: 'center',
    },

});