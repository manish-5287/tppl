import { Image, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
 


export class Header_comp extends Component {
 

    render() {
        return (
           
            <View
                style={{
                    backgroundColor: '#E1F5FE',
                    height: wp(14),
                    borderRadius: wp(1),
                    overflow: 'hidden',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row'

                }}>

                <Image source={require('../../Assets/applogo.png')}
                    style={{
                        width: wp(16),
                        height: wp(13),
                        marginLeft: wp(2)

                    }} />

                <TouchableOpacity onPress={this.handleContract}>
                    <Text
                        style={{
                            color: '#333',
                            fontSize: wp(5),
                            fontWeight: '500',
                            marginRight: wp(35),
                            letterSpacing: wp(0.4)
                        }}>DashBoard</Text>
                </TouchableOpacity>



            </View>
        )
    }
}

export default Header_comp

