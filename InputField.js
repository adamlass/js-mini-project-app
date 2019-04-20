import React from "react"
import {Text, View, TextInput} from "react-native"

export default function (props) {
    return (
        <View
            style={{
                flexDirection: "row",
                backgroundColor: "rgb(244,239,226)",
                padding: 10,
                borderRadius: 20,
                marginTop: 20
            }}
        >
            <Text style={{ flex: 1, textAlign: 'center', fontSize: 15 }}>{props.title}</Text>
            <TextInput style={{
                flex: 2,
                alignSelf: 'stretch',
                textAlign: 'center',
                fontSize: 15,
                borderBottomWidth: 1,
                
            }}
                onChangeText={props.handleChangeText}
                value={props.value}
                secureTextEntry={props.secureTextEntry ? true: false}
                keyboardType={props.numpad ? "number-pad": "default"}
            />
        </View>
    )
}