import React, { Component } from 'react';
import { Text, TextInput, Image, View, TouchableOpacity, Keyboard, Alert, SafeAreaView, TouchableWithoutFeedback, ImageBackground, KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import CustomLoader from '../../Component/loader/Loader';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';
import { KEYS, storeData } from '../../api/User_Preference';
import { getUniqueId } from 'react-native-device-info';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      password: '',
      showProcessingLoader: false,
      showPassword: false,
      isLoading: false
    };
  }

  handleLogin = async () => {
    try {
      const { mobile, password } = this.state;
      Keyboard.dismiss();

      // Validation
      if (!mobile || !password) {
        Alert.alert('Please enter your mobile number and password.');
        return;
      }
      if (!/^\d{10}$/.test(mobile)) {
        Alert.alert('Please enter a valid 10-digit mobile number.');
        return;
      }

      this.setState({ showProcessingLoader: true });

      let uniqueId = getUniqueId();
      const params = { mobile, password, device_id: uniqueId };
      console.log('mobile_params', params);

      const response = await makeRequest(BASE_URL + '/mobile/login', params);
      const { status, message, userId } = response;
      console.log('login', response);

      if (status) {
        // Store data including device ID
        const userInfo = { mobile, userId, deviceId: uniqueId };
        await storeData(KEYS.USER_INFO, userInfo);
        console.log('Stored userInfo:', userInfo);

        // Navigate to the appropriate screen
        this.props.navigation.navigate('mytab', { mobile, userId });
        this.setState({ mobile: '', password: '', showProcessingLoader: false });
      } else {
        Alert.alert(message);
        this.setState({ showProcessingLoader: false });
      }
    } catch (error) {
      console.log(error);
      Alert.alert('An error occurred. Please try again.');
      this.setState({ showProcessingLoader: false });
    }
  };

  handleMobileLogin = (text) => {
    this.setState({ mobile: text });
  };

  handlePassword = (text) => {
    this.setState({ password: text });
  };

  toggleShowPassword = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }));
  };

  handleForget = () => {
    try {
      this.props.navigation.navigate('forget')
    } catch (error) {
      console.log(error);
    }
  }


  render() {
    const { showProcessingLoader } = this.state;
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    return (

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <SafeAreaView style={{ flex: 1, padding: wp(2) }}>

          <View style={{ flex: 1, top: wp(-5) }}>
            <View style={Styles.logo}>
              <Image source={require('../../Assets/Image/tirupati-logo.png')}
                style={{ width: wp(40), height: wp(40) }} resizeMode='contain' />
            </View>

            <View style={Styles.welcomeText}>
              <Text style={{
                fontWeight: '700',
                color: '#000000',
                letterSpacing: wp(0.4),
                fontSize: wp(5.5),
                textAlign: 'center'
              }}>Hello Again!</Text>

              <Text style={{
                fontWeight: '500',
                color: '#383838',
                letterSpacing: wp(0.3),
                fontSize: wp(3.5),
                textAlign: 'center',
                marginTop: wp(2)
              }}>
                It's great to have you back! please log in to access your account.
              </Text>

            </View>

          </View>

          <View style={{ flex: 2,alignSelf:'center' }}>
            {/*  login and password textinput  */}
            <View style={{ marginTop: wp(8) }}>

              <Text style={{
                fontWeight: '500',
                color: '#000000',
                letterSpacing: wp(0.4),
                fontSize: wp(4),
              }}>Mobile</Text>

              <View style={{
                overflow: 'hidden',
                borderRadius: wp(3),
                backgroundColor: '#E0E0E0',
                width: hp(45),
                height: wp(11.2),
                alignSelf: 'center',
                marginTop: wp(1.5)
              }}>
                <TextInput
                  placeholder='Enter mobile number'
                  placeholderTextColor='#757575'
                  keyboardType='number-pad'
                  maxLength={10}
                  value={this.state.mobile}
                  onChangeText={this.handleMobileLogin}

                  style={{
                    paddingLeft: wp(3.5),
                    fontSize: wp(3.5),
                    fontWeight: '400',
                    color: '#757575',
                  }} />
              </View>
            </View>


            <View style={{ marginTop: wp(8) }}>

              <Text style={{
                fontWeight: '500',
                color: '#000000',
                letterSpacing: wp(0.4),
                fontSize: wp(4),
              }}>Password</Text>

              <View style={{
                overflow: 'hidden',
                borderRadius: wp(3),
                backgroundColor: '#E0E0E0',
                width: hp(45),
                height: wp(11.2),
                alignSelf: 'center',
                marginTop: wp(1.5),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <TextInput
                  placeholder='Password'
                  placeholderTextColor='#757575'
                  maxLength={20}
                  keyboardType='name-phone-pad'
                  secureTextEntry={!this.state.showPassword} // Use secureTextEntry conditionally
                  value={this.state.password}
                  onChangeText={this.handlePassword}
                  style={{
                    paddingLeft: wp(3.5),
                    fontSize: wp(3.5),
                    fontWeight: '400',
                    color: '#757575',
                    width: hp(30),

                  }}
                />

                <TouchableOpacity onPress={this.toggleShowPassword}>
                  <Image
                    source={this.state.showPassword ? require('../../Assets/Image/view.png') : require('../../Assets/Image/hide.png')}
                    style={{ width: wp(5.5), height: wp(5.5), marginRight: wp(5) }}
                  />
                </TouchableOpacity>
              </View>

            </View>

            {/* forget password */}
            <TouchableOpacity onPress={this.handleForget}>
              <Text style={{
                fontWeight: '400',
                color: '#757575',
                letterSpacing: wp(0.2),
                fontSize: wp(3.5),
                marginTop: wp(2),
              }}> Forget Password ?</Text>
            </TouchableOpacity>

            {/* login button */}
            <TouchableOpacity style={{
              justifyContent: 'center',
              backgroundColor: '#0293DF',
              height: wp(10.5),
              width: hp(45),
              alignSelf: 'center',
              borderRadius: wp(5),
              marginTop: wp(10),
            }}
              onPress={this.handleLogin}>
              <Text style={{
                color: 'white',
                textAlign: 'center',
                fontSize: wp(4.2),
                fontWeight: '500'
              }}>Log In</Text>
            </TouchableOpacity>
          </View>
          {showProcessingLoader && <ProcessingLoader />}

        </SafeAreaView>

      </TouchableWithoutFeedback >



    );
  }
}

const Styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
  },
  welcomeText: {
    alignSelf: 'center',
    top:wp(-2)
  }
})
