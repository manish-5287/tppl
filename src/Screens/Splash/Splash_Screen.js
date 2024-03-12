import React, { Component } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logoOpacity: new Animated.Value(0), // Initial opacity of logo
            logoScale: new Animated.Value(0.5)   // Initial scale of logo
        };
    }

    componentDidMount() {
        // Animation configuration
        const animationConfig = {
            toValue: 1,            // Final value of opacity
            duration: 2000,        // Duration of the animation in milliseconds
            useNativeDriver: true  // Use native driver for performance
        };

        // Sequence of animations
        Animated.sequence([
            Animated.timing(this.state.logoOpacity, { ...animationConfig }),
            Animated.spring(this.state.logoScale, { toValue: 1, friction: 1, useNativeDriver: true }) // Spring animation for scaling
        ]).start(() => {
            // Animation finished, navigate to the next screen
            // Replace 'NextScreen' with the name of your next screen
            this.props.navigation.replace('login');
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Animated.Image
                    source={require('../../Assets/applogo.png')}
                    style={[styles.logo, { opacity: this.state.logoOpacity, transform: [{ scale: this.state.logoScale }] }]}
                    resizeMode="contain"
                />
                <Text style={{
                    color: '#0477a4',
                    fontSize: wp(6.8),
                    fontWeight: '800',
                    textAlign: 'center',
                    marginTop: wp(-5)
                }}>Tirupati Plastomatics Pvt.Ltd</Text>

                <Text style={{
                    color: '#0477a4',
                    fontSize: wp(3),
                    fontWeight: '500',
                    textAlign: 'center'
                }}>(Integrated Mangement System(IMS) Certified Company)</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 150, // Adjust size of logo as needed
        height: 150 // Adjust size of logo as needed
    }
});

export default SplashScreen;
