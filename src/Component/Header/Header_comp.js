import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { clearData } from '../../api/User_Preference';


export class Header_comp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showProcessingLoader:false
        };
    }


    handleLogout = async () => {
        // Show alert to confirm logout
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    onPress: async () => {
                        // Clear user data (assuming clearData is an async function)
                        await clearData();
                        // Navigate back to the login screen using replace to replace the current screen
                        this.props.navigation.replace('login');
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: false }
        );
    };

   


    render() {
        return (

            <View
                style={{
                    backgroundColor: '#E1F5FE',
                    height: wp(14),
                    borderRadius: wp(1),
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between'

                }}>

                <Image source={require('../../Assets/applogo.png')}
                    style={{
                        width: wp(16),
                        height: wp(13),
                        marginLeft: wp(2.5)

                    }} />

                <Text
                    style={{
                        color: '#333',
                        fontSize: wp(5),
                        fontWeight: '500',
                        letterSpacing: wp(0.4)
                    }}>DashBoard</Text>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                

                    <TouchableOpacity onPress={this.handleLogout}>
                        <Image source={require('../../Assets/Image/logout.png')}
                            style={{
                                width: wp(7),
                                height: wp(7),
                                marginRight: wp(2.5)
                            }} />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

export default Header_comp

