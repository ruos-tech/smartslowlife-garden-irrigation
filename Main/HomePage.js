'use strict';
import React, { Component } from 'react';
import NavigationBar from "miot/ui/NavigationBar";
import {
  MessageDialog
} from 'miot/ui/Dialog';
import Switch from 'miot/ui/Switch';
import NumberSpinner from 'miot/ui/NumberSpinner';
import { Service, Device, Package,DeviceEvent } from "miot";
import { View, StyleSheet,Text,Dimensions, ScrollView, TouchableHighlight, Image } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

/**
 * iOS: windowHeight === screenHeight
 * android: screenHeight - windowHeight = 底部导航条（非全面屏下虚拟按键）的高度
 */
const { width: windowWidth, height: windowHeight } = Dimensions.get('window'); // 视窗尺寸
const { width: screenWidth, height: screenHeight } = Dimensions.get('screen'); // 屏幕尺寸
const statusBarHeight = getStatusBarHeight(true); // 状态栏高度
const titleBarHeight = 44; // 顶部导航栏的高度，在 `TitleBar` 中有定义 TODO: TitleBar 提供静态方法获取导航栏高度
const backgroundContentHeight = windowHeight - 44 - 90; // 背景层的高度
const safeAreaHeight = 0; // 安全区域的高度
const contentInsetBottom = backgroundContentHeight + safeAreaHeight; // ScrollView 内容固定的位置
const scrollViewHeight = windowHeight - statusBarHeight - titleBarHeight; // ScrollView 的高度

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
      scrollMode: false,
      transparent: true,
      contentInsetY: contentInsetBottom,
      device: Device,
      backgroundColor: '#fff',
      showDot: true,
      index: 0,
      // pro2_1: 水龙头开关
      pro2_1: false,
      // pro6_1: led_display
      pro6_1: false,
      pro6_2: 5,
      // pro3_3: 温度
      pro3_3: 25.0,
      // pro3_4:相对湿度
      pro3_4: 23.1,
      messageDialog: false,
    }
    this.myRef = React.createRef()
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
    },
    {
      did: this.state.device.deviceID,
      siid: 6,
      piid: 1
    },
    {
      did: this.state.device.deviceID,
      siid: 6,
      piid: 2
    }
    ];
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

  changeLedDisplay(value){
    console.log('change led display to '+value);
    let params = [{
      did: this.state.device.deviceID,
      siid: 6,
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

  changeAutoStop(value){
    console.log('change auto stop to '+value);
    let params = [{
      did: this.state.device.deviceID,
      siid: 6,
      piid: 2,
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
      } else if(element.siid === 6){
        if(element.piid === 1){
          this.setState({
            pro6_1:v
          });
        } else if(element.piid === 2){
          this.setState({
            pro6_2:v
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
        <Image style={styles.flower} source={require('./Resources/images/flower.png')} />
        {this.state.pro2_1 && (<Image visible={this.state.pro2_1} style={styles.water} source={require('./Resources/images/water.png')} />)}
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
        <ScrollView
          // ref="scrollView"
          ref={this.myRef}
          style={styles.foregroundContainer}
          showsVerticalScrollIndicator={false}
          onScroll={e => this._onScroll(e)}
          onScrollEndDrag={() => this._onScrollEndDrag()}
          onScrollBeginDrag={() => this._onScrollBeginDrag()}
        >
          {this._renderForegroundContent()}
        </ScrollView>
        
      </View>
    )
  }

  componentWillUnmount(){
    this.messageSubscription && this.messageSubscription.remove();
    this.propsSubscription && this.propsSubscription.remove();
  }

  _renderForegroundContent() {
    const contentHeight = scrollViewHeight; // 60 * 6 + 15 * 8; // 计算实际内容的高度
    const bottomBlankHeight = scrollViewHeight - contentHeight > 0 ? scrollViewHeight - contentHeight : 0; // 计算底部垫补空白的高度
    return (
      <View>
        <View style={styles.topBlank}>
          
        </View>
        <View style={styles.foregroundContent}>
          <TouchableHighlight
            key={'togle_switch'}
            underlayColor="#fff"
            style={{ marginBottom: 15 }}
          >
          <View style={styles.switchArea}>
            <Text style={styles.switchText}>水龙头开关</Text><
            Switch style={styles.switchIcon} 
              onTintColor='skyblue'
              tintColor='lightgrey'
              value={this.state.pro2_1}
              onValueChange={value => this.changeSwitch(value)}
              />
          </View>
          </TouchableHighlight>
          <TouchableHighlight
            key={'togle_led_display'}
            underlayColor="#fff"
            style={{ marginBottom: 15 }}
          >
          <View style={styles.switchArea}>
            <Text style={styles.switchText}>指示灯开关</Text>
            <Switch style={styles.switchIcon} 
              onTintColor='skyblue'
              tintColor='lightgrey'
              value={this.state.pro6_1}
              onValueChange={value => this.changeLedDisplay(value)}
              />
          </View>
          </TouchableHighlight>
          <TouchableHighlight
            key={'change_auto_stop_min'}
            underlayColor="#fff"
            style={{ marginBottom: 10 }}
          >
          <View style={styles.switchArea}>
            <Text style={styles.switchText}>自动停止</Text>
            <NumberSpinner
              style={{width:80, height:100}}
              maxValue={60}
              minValue={1}
              interval={1}
              defaultValue={this.state.pro6_2}
              unit={"分钟"}
              lineStyle={"none"}
              onNumberChanged={value => this.changeAutoStop(value.newValue) }
            />
          </View>
        </TouchableHighlight>
        </View>
        <View style={[styles.bottomBlank, { height: bottomBlankHeight }]} >
          
        </View>
      </View>
    )
  }

  _onScrollBeginDrag() {
    this.setState({ scrollMode: true });
  }

  /**
   * 综合考虑速度和位移
   */
  _onScroll(e) {
    this.contentOffsetY = e['nativeEvent']['contentOffset']['y'] + e['nativeEvent']['velocity']['y'] * 300;
  }

  _onScrollEndDrag() {
    const { current } = this.myRef || {}
    if (this.contentOffsetY < contentInsetBottom * 0.5) {
      current && current.scrollTo({ x: 0, y: 0, animated: true });
      this.setState({ scrollMode: false });
    }
    else if (this.contentOffsetY < contentInsetBottom) {
      console.log("top");
      current && current.scrollTo({ x: 0, y: contentInsetBottom, animated: true });
    }
  }

}



var styles = StyleSheet.create({
  flower:{
    bottom: 90,
    alignItems: 'center',
    position: "absolute",
  },
  water:{
    bottom: 90,
    width: screenWidth,
    position: "absolute",
  },
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
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 25,
    marginRight: 25,
    textAlignVertical: "center",
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
  },
  backgroundContainer: {
    width: windowWidth,
    backgroundColor: 'lightpink',
    height: backgroundContentHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundContent: {
    backgroundColor: '#fff',
    height: backgroundContentHeight / 2,
    width: windowWidth / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foregroundContainer: {
    position: "absolute",
    backgroundColor: "transparent",
    // backgroundColor: "green",
    height: scrollViewHeight,
  },
  topBlank: {
    height: backgroundContentHeight,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  foregroundContent: {
    width: windowWidth,
    backgroundColor: '#fff',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: '#EFEFEF',
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  bottomBlank: {
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center'
  }
});