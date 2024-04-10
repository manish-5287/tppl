import React, {Component} from 'react';
import {View, StyleSheet, Animated, Text, Image} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


// Import your logo image
import logo from '../../Assets/applogo.png';
class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoOpacity: new Animated.Value(0), // Initial opacity of logo
      logoScale: new Animated.Value(0.85), // Initial scale of logo
    };
  }

  componentDidMount() {
    // Animation configuration
    const animationConfig = {
      toValue: 1, // Final value of opacity
      duration: 2000, // Duration of the animation in milliseconds
      useNativeDriver: true, // Use native driver for performance
    };

    // Sequence of animations
    Animated.timing(this.state.logoOpacity, {
      ...animationConfig,
      delay: 500, // Adding delay to match the spring animation in the previous implementation
    }).start();

    Animated.spring(this.state.logoScale, {
      toValue: 1,
      friction: 1,
      useNativeDriver: true,
    }).start();
  }

  render() {
    const {logoOpacity, logoScale} = this.state;

    return (
      <View style={styles.container}>
        <Animated.Image
          source={logo}
          style={[
            styles.logo,
            {
              opacity: logoOpacity,
              transform: [{scale: logoScale}],
            },
          ]}
          resizeMode="cover"
        />
        <Text
          style={{
            color: '#0477a4',
            fontSize: hp(3.5),
            fontWeight: '500',
            textAlign: 'center',
          }}>
          Tirupati Plastomatics Pvt.Ltd
        </Text>
        <Text
          style={{
            color: '#0477a4',
            fontSize: hp(1.5),
            fontWeight: '400',
            textAlign: 'center',
          }}>
          (Integrated Management System (IMS) Certified Company)
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
   width:wp(30),
   height:wp(30),
  resizeMode:'contain'
  },
});

export default SplashScreen;