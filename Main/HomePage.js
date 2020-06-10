'use strict';
import React, { Component } from 'react';
import { Package, Host } from 'miot';
import NavigationBar from "miot/ui/NavigationBar";
import Separator from 'miot/ui/Separator';
import { ScrollView, View, Text } from 'react-native';

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
      backgroundColor: '#fff',
      showDot: true,
      index: 0,
    }
  }

  renderCustomNavigation() {
    if (!this.state.transparent) return null;
    return (
      <NavigationBar
        backgroundColor='transparent'
        // type={NavigationBar.TYPE.DARK}
        left={[
          {
            key: NavigationBar.ICON.BACK,
            onPress: _ => this.props.navigation.goBack()
          },
          {
            key: NavigationBar.ICON.CLOSE,
            onPress: _ => this.props.navigation.goBack()
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
        title='智慧慢生活-花园-灌溉系统'
        subtitle=''
        onPressTitle={_ => console.log('onPressTitle')}
      />
    );
  }

  render() {
    return (
      <View style={{ backgroundColor: this.state.backgroundColor, flex: 1 }}>
        {this.renderCustomNavigation()}
        <Separator />
        <ScrollView>
          <Text>Hello, Ruos Tech Smart Slow Life.</Text>
          <Text>API_LEVEL:{Package.minApiLevel}</Text>
          <Text>NATIVE_API_LEVEL:{Host.apiLevel}</Text>
          <Text>{Package.packageName}</Text>
          <Text>models:{Package.models}</Text>
        </ScrollView>
      </View>
    )
  }

};