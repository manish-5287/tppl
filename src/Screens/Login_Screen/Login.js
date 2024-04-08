import React, { Component } from 'react';
import { Text, TextInput, Image, View, TouchableOpacity, Keyboard, Alert, SafeAreaView, TouchableWithoutFeedback, ImageBackground, KeyboardAvoidingView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import CustomLoader from '../../Component/loader/Loader';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';
import { KEYS, getData, storeData } from '../../api/User_Preference';
import { getUniqueId } from 'react-native-device-info';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      password: '',
      showProcessingLoader: false,
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

  render() {
    const { showProcessingLoader } = this.state;
    return (
      <ImageBackground source={require('../../Assets/Image/img1.jpg')} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1}} behavior="padding" enabled>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ backgroundColor: 'white', position: 'absolute', alignSelf: 'center', height: hp(75), width: hp(45), alignItems: 'center', marginTop: wp(20), borderRadius: wp(5), overflow: 'hidden', shadowColor: '#039BE5', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 5, elevation: 8 }}>
              <Image source={require('../../Assets/applogo.png')} style={{ width: wp(25), height: wp(25), resizeMode: 'contain', alignSelf: 'center' }} />
              <Text style={{ color: '#0477a4', fontSize: wp(6.2), fontWeight: '800', textAlign: 'center' }}>Tirupati Plastomatics Pvt.Ltd</Text>
              <Text style={{ color: '#0477a4', fontSize: wp(2.5), fontWeight: '500', textAlign: 'center' }}>(Integrated Mangement System(IMS) Certified Company)</Text>
              <Text style={{ color: '#0477a4', fontSize: wp(5), fontWeight: '500', marginTop: wp(8), alignSelf: 'flex-start', marginLeft: wp(5), letterSpacing: wp(0.3), top: wp(4) }}>Login to Continue</Text>

              <View style={{ overflow: 'hidden', marginTop: wp(8), borderColor: '#0477a4', borderRadius: wp(2), borderWidth: wp(0.2), width: hp(40), height: wp(11.2), flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../../Assets/Image/user.png')} style={{ width: wp(5), height: wp(5), marginLeft: wp(5) }} />
                <TextInput placeholder='Enter mobile number' placeholderTextColor='#004561' keyboardType='number-pad' maxLength={10} value={this.state.mobile} onChangeText={this.handleMobileLogin} style={{ paddingLeft: wp(3), fontSize: wp(3.9), fontWeight: '400', color: '#004561', width: hp(40) }} />
              </View>


              <View style={{ overflow: 'hidden', marginTop: wp(7), borderColor: '#0477a4', borderRadius: wp(2), borderWidth: wp(0.2), width: hp(40), height: wp(11.2), flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../../Assets/Image/lock.png')} style={{ width: wp(4.2), height: wp(4.2), marginLeft: wp(5) }} />
                <TextInput placeholder='Password' placeholderTextColor='#004561' maxLength={20} keyboardType='name-phone-pad' secureTextEntry={true} value={this.state.password} onChangeText={this.handlePassword} style={{ paddingLeft: wp(3), fontSize: wp(3.9), fontWeight: '400', color: '#004561', width: hp(40) }} />
              </View>


              <TouchableOpacity style={{ justifyContent: 'center', backgroundColor: '#0477a4', height: wp(10.5), width: hp(40), alignSelf: 'center', borderRadius: wp(2), marginTop: wp(6.5) }} onPress={this.handleLogin}>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: wp(4.2), fontWeight: '500' }}>Login</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
          {showProcessingLoader && <ProcessingLoader />}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

export default Login;
