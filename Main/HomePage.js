'use strict';
import React, { Component } from 'react';
import NavigationBar from "miot/ui/NavigationBar";
import Switch from 'miot/ui/Switch';
import { Service, Device } from "miot";
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
      pro2_1: false,
    }
  }

  renderCustomNavigation() {
    if (!this.state.transparent) return null;
    return (
      <NavigationBar
        backgroundColor='transparent'
        subtitle='智慧灌溉系统'
        // type={NavigationBar.TYPE.DARK}
        left={[
          {
            key: NavigationBar.ICON.BACK,
            onPress: _ => {
              console.log("go back.");
              this.props.navigation.goBack();
            }
          },
          {
            key: NavigationBar.ICON.CLOSE,
            onPress: _ => {
              console.log("go close.");
              this.props.navigation.goBack()
            }
          }
        ]}
        right={[
          {
            key: NavigationBar.ICON.COLLECT,
            onPress: _ => console.log('onPress collect')
          },
          {
            key: NavigationBar.ICON.MORE,
            showDot: this.state.showDot,
            onPress: _ => console.log('onPress more')
          }
        ]}
        title='智慧慢生活-智慧花园'
        onPressTitle={_ => console.log('onPressTitle')}
      />

    );
  }

  componentDidMount() {
    console.log("device info:");
    console.log(this.state.device);
    let params = [{
      did: this.state.device.deviceID,
      siid: 2,
      piid: 1
    }];
    Service.spec.getPropertiesValue(params).then(res => {
      console.log("res", res);
      // res.
      // this.setState({})
    }).catch(error => {
        console.log("error", error)
    });
  }

  changeSwitch(value){
    let params = [{
      did: this.state.device.deviceID,
      siid: 2,
      piid: 1
    }];
    Service.spec.setPropertiesValue(params).then(res => {
      console.log("res", res)
    }).catch(error => {
        console.log("error", error)
    });
    this.setState({pro2_1:value});
  }

  render() {
    return (
      <View style={{ backgroundColor: this.state.backgroundColor, flex: 1 }}>
        {this.renderCustomNavigation()}
        <View style={styles.mainContent}>
          <Text>更多内容，敬请期待,{this.state.device.deviceID}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.switchArea}>
            <Text style={styles.switchText}>水龙头开关</Text><Switch style={styles.switchIcon} 
              onTintColor='skyblue'
              tintColor='lightpink'
              value={this.state.pro2_1}
              onValueChange={value => this.changeSwitch(value)}
              />
          </View>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  mainContent: {
    marginTop: 25,
    marginLeft: 25,
  },
  footer: {
    width: '100%',
    height: 100,
    bottom: 0,
    position: "absolute",
    fontSize: 14,
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