/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { Entrance, API_LEVEL, PackageEvent, Package, Device, Service, Host } from 'miot';
import { View, Text, TouchableOpacity } from 'react-native';

import App from "./Main";

PackageEvent.packageAuthorizationCancel.addListener(() => {
    // 用户撤销授权,需要清除缓存
    console.log("packageAuthorizationCancel");
    let licenseKey = "license-" + Device.deviceID;
    Host.storage.set(licenseKey, false);
    Package.exit();
})

PackageEvent.packageViewWillAppear.addListener(() => { console.log("packageViewWillAppear") });
PackageEvent.packageWillLoad.addListener(() => { console.log("packageWillLoad") });
PackageEvent.packageDidLoaded.addListener(() => { console.log("packageDidLoaded") });
PackageEvent.packageDidResume.addListener(() => { console.log("packageDidResume") });
PackageEvent.packageWillPause.addListener(() => { console.log("packageWillPause") });
PackageEvent.packageWillExit.addListener(() => { console.log("packageWillExit") });
PackageEvent.packageViewWillDisappearIOS.addListener(() => { console.log("packageViewWillDisappearIOS") });

class Apps extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'powderblue' }}>
                <TouchableOpacity>
                    <Text>hello, this is a tiny plugin project of MIOT</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
Package.entry(App, _ => { })