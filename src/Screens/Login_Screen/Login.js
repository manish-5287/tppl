import React, { Component } from 'react';
import { Text, TextInput, Image, View, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import CustomLoader from '../../Component/loader/Loader';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';
import { showToast } from '../../Component/tost/ShowToast';

export class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mobile: '',
      password: '',
      showProcessingLoader: false
    }
  };


  handleLogin = async () => {
    try {
      const { mobile, password } = this.state;
      Keyboard.dismiss();
  
      this.setState({ showProcessingLoader: true })
      const params = { mobile, password };
      console.log('mobile_params', params);
      const response = await makeRequest(BASE_URL + '/mobile/login', params);
      const { status, message } = response;
      console.log(response);
      if (response) {
        if (status === true) {
          this.setState({ showProcessingLoader: false });
          this.props.navigation.navigate('mytab', { mobile, password });
          this.setState({ mobile: '', password: ''});
          Alert.alert(message);
        } else {
          Alert.alert(message);
          this.props.navigation.navigate('login')
          this.setState({ showProcessingLoader: false })

        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  handleMobileLogin = (Text) => {
    this.setState({ mobile: Text });
  };

  handlePassword = (Text) => {
    this.setState({ password: Text });
  };



  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
  }
  const { showProcessingLoader } = this.state
    return (

      <View style={{ backgroundColor: 'white', flex: 1, padding: 3 }}>
        <View style={{
          backgroundColor: 'white',
          flex: 1
        }}>
          <Image source={require('../../Assets/applogo.png')}
            style={{
              width: wp(28),
              height: wp(28),
              resizeMode: 'contain',
              alignSelf: 'center',

            }} />
          <Text style={{
            color: '#0477a4',
            fontSize: wp(7.2),
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

        <View style={{ backgroundColor: "white", flex: 2 }}>

          <View style={{ alignSelf: 'center', marginTop: wp(15) }} >
            <Text style={{ color: '#0477a4', fontSize: wp(7), fontWeight: '700', marginLeft: wp(1) }}>Welcome To TPPL !</Text>
            <Text style={{ color: '#004561', fontSize: wp(4.2), fontWeight: '400', marginLeft: wp(1), marginTop: wp(1) }}>Please login to continue</Text>


            <View style={{ alignSelf: 'center', marginTop: wp(5), borderWidth: wp(0.4), borderColor: 'rgba(0,69,97,.4)', borderRadius: wp(10), width: wp(90), height: wp(11.2), flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../../Assets/Image/user.png')} style={{ width: wp(5), height: wp(5), marginLeft: wp(5) }} />
              <TextInput
                placeholder='Enter mobile number'
                placeholderTextColor='#004561'
                keyboardType='number-pad'
                maxLength={10}
                value={this.state.mobile}
                onChangeText={this.handleMobileLogin}
                style={{ paddingLeft: wp(3), fontSize: wp(3.9), fontWeight: '400', color: '#004561' }} />
            </View>


            <View style={{ alignSelf: 'center', marginTop: wp(8), borderWidth: wp(0.4), borderColor: 'rgba(0,69,97,.4)', borderRadius: wp(10), width: wp(90), height: wp(11.2), flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../../Assets/Image/lock.png')} style={{ width: wp(4.2), height: wp(4.2), marginLeft: wp(5) }} />
              <TextInput
                placeholder='Password'
                placeholderTextColor='#004561'
                maxLength={20}
                keyboardType='name-phone-pad'
                value={this.state.password}
                onChangeText={this.handlePassword}
                style={{ paddingLeft: wp(3), fontSize: wp(3.9), fontWeight: '400', color: '#004561' }} />
            </View>



            <TouchableOpacity onPress={this.handleLogin}>
              <View style={{ justifyContent: 'center', backgroundColor: '#5db0c3', height: wp(10.5), width: wp(30), alignSelf: 'center', marginTop: wp(8), borderRadius: wp(5.2) }}>
                <Text style={{ color: 'white', textAlign: 'center', fontSize: wp(4.2), fontWeight: '500' }}>Login</Text>
              </View>
            </TouchableOpacity>
          </View>



        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1

        }}>
          <View style={{
            backgroundColor: '#5db0c3',
            width: wp(40),
            height: wp(40),
            borderRadius: wp(30),
            right: wp(11),
            top: wp(30)

          }}>
          </View>
          <View style={{
            backgroundColor: '#abd6dc',
            width: wp(45),
            height: wp(45),
            borderRadius: wp(30),
            left: wp(12),
            top: wp(15)
          }}>
          </View>
        </View>




        {showProcessingLoader && <ProcessingLoader/>}
      </View >

    )
  }
}

export default Login;
