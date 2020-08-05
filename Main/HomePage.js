'use strict';
import React, { Component } from 'react';
import NavigationBar from "miot/ui/NavigationBar";
import {
  MessageDialog
} from 'miot/ui/Dialog';
import Switch from 'miot/ui/Switch';
import { Service, Device, Package,DeviceEvent } from "miot";
import { View, StyleSheet,Text } from 'react-native';

export default class HomePage extends React.Component {

  static navigationOptions = ({ navigation }) => {

    const { titleProps } = navigation.state.params || {};
    if (!titleProps) return { header: null }
    return {
      header: <NavigationBar {...titleProps} />
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      transparent: true,
      device: Device,
      backgroundColor: '#fff',
      showDot: true,
      index: 0,
      // pro2_1: 水龙头开关
      pro2_1: false,
      // pro3_3: 温度
      pro3_3: 25.0,
      // pro3_4:相对湿度
      pro3_4: 23.1,
      messageDialog: false,
    }
  }

  UNSAFE_componentWillMount() {
    this.setNavigation();
  }

  setNavigation() {
    this.props.navigation.setParams({
      titleProps: {
        left: [
          {
            key: NavigationBar.ICON.BACK,
            onPress: () => {
              Package.exit();
            }
          }
        ],
        right: [
          // {
          //   key: NavigationBar.ICON.COLLECT,
          //   onPress: () => console.log('onPress collect')
          // },
          {
            key: NavigationBar.ICON.MORE,
            showDot: this.state.showDot,
            onPress: () => console.log('onPress')
          }
        ],
        subtitle: '智慧灌溉系统',
        title: '智慧慢生活-智慧花园',
        backgroundColor: '#fff'
      }
    });
    this.setState({
      index: 0,
      backgroundColor: '#fff',
      transparent: false
    });
  }
  
  handleReceivedMessage = (device, message) => {
    if (!message) {
      return;
    }
    if(message.get("prop.2.1")){
      this.setState({
        pro2_1:message.get("prop.2.1")[0],
        messageDialog: true
      });
    }
  }

  componentDidMount() {
    // console.log("device info:");
    // console.log(this.state.device);
    // Service.spec.getSpecString(this.state.device.deviceID).then(res => {
    //   console.log("get spec string res", res)
    // }).catch(error => {
    //     console.log("error", error)
    // });
    let params = [{
      did: this.state.device.deviceID,
      siid: 2,
      piid: 1
    }];
    Service.spec.getPropertiesValue(params).then(res => {
      // console.log("res", res);
      res.forEach(element => {
        this.syncProperty(element);
      });
    }).catch(error => {
        console.log("get property error", error)
    });

    // subscribe props change and add listener
    this.messageSubscription = DeviceEvent.deviceReceivedMessages.addListener(this.handleReceivedMessage);
    Device.getDeviceWifi().subscribeMessages("prop.2.1").then((subscription) => {
      this.propsSubscription = subscription;
    }).catch((err) => {
      // console.log(err);
    });




  }

  changeSwitch(value){
    console.log('change switch to '+value);
    let params = [{
      did: this.state.device.deviceID,
      siid: 2,
      piid: 1,
      value
    }];
    Service.spec.setPropertiesValue(params).then(res => {
      res.forEach(element => {
        element.value = value;
        this.syncProperty(element);
      });
    }).catch(error => {
        console.log("set property error", error)
    });
  }

  syncProperty(element){
    if(element.code === 0){
      let v = element.value;
      if(element.siid === 2){
        if(element.piid === 1){
          this.setState({
            pro2_1:v
          });
        }
      }
    } else {
      console.log('get/set property error.',element);
    }
  }

  render() {
    return (
      <View style={{ backgroundColor: this.state.backgroundColor, flex: 1 }}>
        {/* 
        <View style={styles.mainContent}>
          <View style={styles.tempArea}>
            <Text style={styles.mainContentLabel}>当前温度</Text>
            <Text style={styles.mainContentValue}>{this.state.pro3_3}</Text>
            <Text style={styles.mainContentUnit}>℃</Text>
          </View>
          <View style={styles.tempArea}>
            <Text style={styles.mainContentLabel}>相对湿度</Text>
            <Text style={styles.mainContentValue}>{this.state.pro3_4}</Text>
            <Text style={styles.mainContentUnit}>%</Text>
          </View>
        </View>
         */}
        <MessageDialog
          type={MessageDialog.TYPE.UNDERLINE}
          message={this.state.pro2_1 ? '开始浇水了':'停止浇水了'}
          timeout={3000}
          buttons={[
            {
              text: '了解了',
              style: { color: 'lightblue' },
              callback: () => {
                this.setState({ messageDialog: false })
              }
            },
          ]}
          onDismiss={(e) => {
            this.setState({messageDialog:false});
          }}
          visible={this.state.messageDialog}
        />
        <View style={styles.footer}>
          <View style={styles.switchArea}>
            <Text style={styles.switchText}>水龙头开关</Text><Switch style={styles.switchIcon} 
              onTintColor='skyblue'
              tintColor='lightgrey'
              value={this.state.pro2_1}
              onValueChange={value => this.changeSwitch(value)}
              />
          </View>
        </View>
      </View>
    )
  }

  componentWillUnmount(){
    this.messageSubscription && this.messageSubscription.remove();
    this.propsSubscription && this.propsSubscription.remove();
  }
}

var styles = StyleSheet.create({
  mainContent: {
    marginTop: 25,
    marginLeft: 25,
  },
  mainContentLabel: {
    fontSize: 20,
    fontWeight: "bold",
    textAlignVertical: "center"
  },
  mainContentValue: {
    fontSize: 85,
    fontWeight: "bold",
    textAlign: "right",
    textAlignVertical: "center"
  },
  mainContentUnit: {
    fontSize: 18,
    textAlignVertical: "top",
    textAlign: "left",
    marginRight: 35
  },
  tempArea: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between'
  },
  footer: {
    width: '100%',
    height: 100,
    bottom: 0,
    position: "absolute",
    borderColor: '#EFEFEF',
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  switchArea: {
    marginTop: 35,
    marginLeft: 25,
    marginRight: 25,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between'
  },
  switchText: {
    fontSize: 20,
    fontWeight: "bold"
  },
  switchIcon: {
    width: 50, 
    height: 25,
    marginRight: 25
  }
});