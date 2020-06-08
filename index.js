/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { API_LEVEL, Package, Device, Service, Host } from 'miot';
import { PackageEvent, DeviceEvent } from 'miot';
import { View, Text } from 'react-native';

class App extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'powderblue' }}>
                <Text>Hello, Ruos Tech Smart Slow Life.</Text>
                <Text>API_LEVEL:{Package.minApiLevel}</Text>
                <Text>NATIVE_API_LEVEL:{Host.apiLevel}</Text>
                <Text>{Package.packageName}</Text>
                <Text>models:{Package.models}</Text>
            </View>
        )
    }
}
Package.entry(App, () => {

})
