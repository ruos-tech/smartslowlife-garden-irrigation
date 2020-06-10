'use strict';

import React from 'react';
import TitleBar from "miot/ui/TitleBar";
import { createStackNavigator } from 'react-navigation'; //
import HomePage from "./HomePage";

const RootStack = createStackNavigator(
  {
    HomePage,
  },
  {
    // ThirdPartyDemo
    initialRouteName: 'HomePage',
    navigationOptions: ({ navigation }) => ({
      header: <TitleBar
        title={navigation.state.params ? navigation.state.params.title : ''}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
    })
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />
  }
}
