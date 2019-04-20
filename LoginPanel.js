import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, TouchableWithoutFeedback, Animated, TextInput, Keyboard, Image } from 'react-native';
import { Constants, Location, Permissions, MapView, PROVIDER_GOOGLE, Notifications } from 'expo';
import InputField from "./InputField"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView } from 'react-native-gesture-handler';
import Facade from './Facade';


export default class LoginPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            expanded: false,
            animation: new Animated.Value(),
            userName: "a",
            password: "a",
            distance: "19000",
            loggingIn: false,
            user: null,
            error: null,


        }
        this.state.animation.setValue(90)
    }

    getHeight = () => {
        if (this.state.expanded) {
            return 300
        }
        return 90
    }

    toggle = async () => {
        let before = this.getHeight()
        await this.setState({ expanded: !this.state.expanded })
        let after = this.getHeight()


        this.state.animation.setValue(before)
        Animated.spring(
            this.state.animation,
            {
                toValue: after
            }
        ).start()
    }

    handleLogin = async () => {


        var { userName, password, distance } = this.state
        let { coords } = await Location.getCurrentPositionAsync()
        let { latitude, longitude } = coords

        // Get the token that uniquely identifies this device
        let pushToken = await Notifications.getExpoPushTokenAsync();

        var body = {
            userName,
            password,
            distance,
            latitude,
            longitude,
            pushToken,
        }
        try {
            var content = await Facade.login(body)
            this.props.newFriends(content["friends"])
            this.setState({ loggingIn: false, user: userName, error: null })
        } catch (err) {
            this.setState({ loggingIn: false, error: "Login failed!" })
        }
    }


    handleLoginPress = () => {
        Keyboard.dismiss()
        this.toggle()
        if (this.state.expanded && !this.state.loggingIn) {
            this.setState({ loggingIn: true })
            this.handleLogin()
        }
    }

    async componentDidUpdate() {
        console.log("hello")
        if (this.props.reset) {
            if (this.state.expanded) {
                console.log("reset:", this.props.reset)
                await this.props.resetReset()
                console.log("reset val:", this.props.reset)
                await this.toggle()
            } else {
                this.props.resetReset()
            }
        }

    }

    render() {

        return (
            <Animated.View style={[styles.view, { height: this.state.animation }]}>
                <TouchableWithoutFeedback
                    style={styles.button}
                    onPress={this.handleLoginPress}
                >
                    {this.state.loggingIn ?
                        <Image style={{ height: 55, width: 55, padding: 0 }} source={require("./assets/loading-3.gif")} />
                        :
                        <View>
                            {
                                this.state.expanded ?
                                    <Text style={styles.buttonText2}>Login</Text>
                                    :
                                    <View>
                                        {this.state.error ?
                                            <Text style={styles.buttonTextError}>{this.state.error}</Text>
                                            :
                                            <Text style={this.state.expanded ? styles.buttonText2 : styles.buttonText1}>
                                                {this.state.user && !this.state.expanded ?
                                                    `Logged in as ${this.state.user}`
                                                    : "Login"
                                                }
                                            </Text>
                                        }
                                    </View>
                            }

                        </View>

                    }
                </TouchableWithoutFeedback>

                <ScrollView
                    style={{ alignSelf: "stretch", padding: 20 }}

                >



                    <InputField
                        title={"UserName"}
                        value={this.state.userName}
                        handleChangeText={(userName) => this.setState({ userName })}
                    />
                    <InputField
                        title={"Password"}
                        value={this.state.password}
                        handleChangeText={(password) => this.setState({ password })}
                        secureTextEntry
                    />
                    <InputField
                        title={"Distance (m)"}
                        value={this.state.distance}
                        handleChangeText={(distance) => this.setState({ distance })}
                        numpad
                    />



                </ScrollView>


            </Animated.View>
        )

    }
}
const styles = StyleSheet.create({
    view: {

        backgroundColor: "rgb(155,166,107)",
        alignItems: "center",
        padding: 0,
        paddingTop: 5,
        borderTopWidth: 4,
        borderColor: "rgb(230,129,78)"


    },
    button: {
        marginTop: 0,
        margin: 0,
        // width: "100%",
        alignSelf: "stretch",
        // alignItems: "center",
        flex: 1,
    },
    buttonText1: {
        color: "rgb(244,239,226)",
        fontSize: 30,
        paddingTop: 10,
    },

    buttonText2: {
        color: "white",
        fontSize: 35,
        marginBottom: 0,
        paddingTop: 10,
    },

    buttonTextError: {
        color: "red",
        fontSize: 30,
        paddingTop: 10,
    },
});