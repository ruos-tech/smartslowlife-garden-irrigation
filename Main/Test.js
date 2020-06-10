'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class Test extends React.Component {

  render() {
    return (
      <View style={{ backgroundColor: this.state.backgroundColor, flex: 1 }}>
        <Text>Hello, Ruos Tech Smart Slow Life.</Text>
      </View>
    )
  }

}