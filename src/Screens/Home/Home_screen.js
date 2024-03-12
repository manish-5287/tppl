import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { Component } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Header_comp from '../../Component/Header/Header_comp';
import Po_Table from '../../Component/Table/Po_Table';
import Production_order from '../../Component/Table/Production_Table';
import GRN_Table from '../../Component/Table/GRN_Table';
import Indents, { Indents_Table } from '../../Component/Table/Indents_Table';
import Reverses, { Reverses_Table } from '../../Component/Table/Reverses_Table';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import Production_Table from '../../Component/Table/Production_Table';


export default class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contractData: {
        contractcount: 0,
        todaycontractcount: 0,
        weekcontractcount: 0,
        monthcontractcount: 0
      },

      purchaseData: {
        purchasenordercount: 0,
        todaypurchasenordercount: 0,
        weekpurchasenordercount: 0,
        monthpurchasenordercount: 0
      },
      grnData: {
        totalgrncount: 0,
        todaylgrncount: 0,
        weeklgrncount: 0,
        monthgrncount: 0
      },
      supplierData: {
        suppliercount: 0,
        todaylsuppliercount: 0,
        weeklsuppliercount: 0,
        monthsuppliercount: 0
      },

      maintenanceData: {
        maintenancecount: 0,
        todaymaintenancecount: 0,
        weekmaintenancecount: 0,
        monthmaintenancecount: 0
      }


    }
  };

  componentDidMount() {
    this.handleSliderBox();

  };

  handleSliderBox = async () => {
    try {
      const response = await makeRequest(BASE_URL + '/mobile/dashboard');
      const { success, message, contractHeader, poHeader, grnHeader, supplierHeader, maintenanceHeader } = response;
      console.log('sdsad', response);
      if (success) {

        if (contractHeader.length > 0 || poHeader.length > 0 || grnHeader.length > 0 || supplierHeader.length > 0 || maintenanceHeader.length > 0) {
          this.setState({
            contractData: contractHeader[0],
            purchaseData: poHeader[0],
            grnData: grnHeader[0],
            supplierData:supplierHeader[0],
            maintenanceData:maintenanceHeader[0]

          });
        }
      } else {
        console.log(message);
      }
    } catch (error) {
      console.log(error);
    }
  };


  handlePO = () => {
    try {

      this.props.navigation.navigate('PO')
    } catch (error) {
      console.log(error);
    }
  }

  handleProduction = () => {
    try {

      this.props.navigation.navigate('Production')
    } catch (error) {
      console.log(error);
    }
  }
  handleGRN = () => {
    try {
      this.props.navigation.navigate('GRN')
    } catch (error) {
      console.log(error);
    }
  }
  handleContract = () => {
    try {

      this.props.navigation.navigate('Contract')
    } catch (error) {
      console.log(error);
    }
  }

  handleIndent = () => {
    try {

      this.props.navigation.navigate('Indent')
    } catch (error) {
      console.log(error);
    }
  }

  handleReverse = () => {
    try {

      this.props.navigation.navigate('Reverse')
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { contractData, purchaseData, grnData,supplierData,maintenanceData } = this.state;
    console.log('mansih', contractData);
    return (
      <>
        <Header_comp />
        <View style={{ padding: wp(2), flex: 1, backgroundColor: '#fefefc' }}>

          {/* Header slider */}
          <View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

              <View style={Styles.slider_box1}>
                <View style={Styles.box1}>
                  <TouchableOpacity onPress={this.handleContract}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: wp(3),
                        fontWeight: '500',
                        marginLeft: wp(2),
                        letterSpacing: wp(0.1),
                      }}>
                      Contract ({contractData.contractcount})
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={Styles.second_box}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1),
                    }}>
                    Today - {contractData.todaycontractcount}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1),
                    }}>
                    This Week - {contractData.weekcontractcount}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1),
                    }}>
                    This Month - {contractData.monthcontractcount}
                  </Text>
                </View>
              </View>

              {/* box 2 */}

              <View style={Styles.slider_box2}>
                <View style={Styles.box2}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(3),
                      fontWeight: '500',
                      marginLeft: wp(2)
                    }}>
                    Purchase Order ({purchaseData.purchasenordercount})
                  </Text>

                </View>
                <View style={Styles.second_box}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1)
                    }}>
                    Today - {purchaseData.todaypurchasenordercount}
                  </Text>

                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1)
                    }}>
                    This Week - {purchaseData.weekpurchasenordercount}
                  </Text>

                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1)
                    }}>
                    This Month - {purchaseData.monthpurchasenordercount}
                  </Text>

                </View>

              </View>

              {/* box 3 */}

              <View style={Styles.slider_box3}>
                <View style={Styles.box3}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(3),
                      fontWeight: '500',
                      marginLeft: wp(2)
                    }}>
                    GRN ({grnData.totalgrncount})
                  </Text>

                </View>
                <View style={Styles.second_box}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1)
                    }}>
                    Today - {grnData.todaylgrncount}
                  </Text>

                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1)
                    }}>
                    This Week - {grnData.weeklgrncount}
                  </Text>

                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1)
                    }}>
                    This Month - {grnData.monthgrncount}
                  </Text>

                </View>


              </View>

              {/* box 4 */}
              <View style={Styles.slider_box4}>
                <View style={Styles.box4}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(3),
                      fontWeight: '500',
                      marginLeft: wp(2)
                    }}>
                    Vendors ({supplierData.suppliercount})
                  </Text>

                </View>
                <View style={Styles.second_box}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1)
                    }}>
                    Today - {supplierData.todaylsuppliercount}
                  </Text>

                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1)
                    }}>
                    This Week - {supplierData.weeklsuppliercount}
                  </Text>

                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1)
                    }}>
                    This Month - {supplierData.monthsuppliercount}
                  </Text>

                </View>
              </View>

              {/* box 5 */}
              <View style={Styles.slider_box5}>
                <View style={Styles.box5}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(3),
                      fontWeight: '500',
                      marginLeft: wp(2)
                    }}>
                    Maintenance ({maintenanceData.maintenancecount})
                  </Text>

                </View>
                <View style={Styles.second_box}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1)
                    }}>
                    Today - {maintenanceData.todaymaintenancecount}
                  </Text>

                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1)
                    }}>
                    This Week - {maintenanceData.weekmaintenancecount}
                  </Text>

                  <Text
                    style={{
                      color: 'white',
                      fontSize: wp(2.8),
                      fontWeight: '500',
                      marginLeft: wp(2),
                      letterSpacing: wp(0.1)
                    }}>
                    This Month - {maintenanceData.monthmaintenancecount}
                  </Text>

                </View>
              </View>
            </ScrollView>
          </View>

          {/* Table */}

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* Purchase Order */}
            <View style={{ marginTop: wp(5), borderColor: '#039BE5', borderWidth: wp(0.1), borderRadius: wp(0.5), alignSelf: 'center', }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: wp(1), marginTop: wp(2) }}>
                <Text style={{
                  fontSize: wp(5),
                  fontWeight: '500',
                  color: '#039BE5',
                  letterSpacing: wp(0.1),

                }}>Purchase Order</Text>
                <TouchableOpacity onPress={this.handlePO}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: wp(1), right: wp(2) }}>
                    <Text style={{
                      fontSize: wp(3),
                      fontWeight: '500',
                      color: '#039BE5',
                      marginRight: wp(1)
                    }}
                    >View More</Text>
                    <Image source={require('../../Assets/Image/production-arrow.png')} style={{ width: wp(2.5), height: wp(2.5) }} />
                  </View>
                </TouchableOpacity>
              </View>

              <Po_Table />
            </View>

            {/* Production Orders */}

            <View style={{ marginTop: wp(5), borderColor: "#40856f", borderWidth: wp(0.1), borderRadius: wp(0.5), alignSelf: 'center', }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: wp(1), marginTop: wp(2) }}>
                <Text style={{
                  fontSize: wp(5),
                  fontWeight: '500',
                  color: "#40856f",
                  letterSpacing: wp(0.1)
                }}>Production Order</Text>
                <TouchableOpacity onPress={this.handleProduction}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: wp(1), right: wp(2) }}>
                    <Text style={{
                      fontSize: wp(3),
                      fontWeight: '500',
                      color: "#40856f",
                      marginRight: wp(1)
                    }}
                    >View More</Text>
                    <Image source={require('../../Assets/Image/right-arrow.png')} style={{ width: wp(2.5), height: wp(2.5) }} />
                  </View>
                </TouchableOpacity>
              </View>

              <Production_Table />
            </View>

            {/* GRN */}

            <View style={{ marginTop: wp(5), borderColor: '#8D6E63', borderWidth: wp(0.1), borderRadius: wp(0.5), alignSelf: 'center', }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: wp(1), marginTop: wp(2) }}>
                <Text style={{
                  fontSize: wp(5),
                  fontWeight: '500',
                  color: '#8D6E63',
                  letterSpacing: wp(0.1)
                }}>GRN</Text>
                <TouchableOpacity onPress={this.handleGRN}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: wp(1), right: wp(2) }}>
                    <Text style={{
                      fontSize: wp(3),
                      fontWeight: '500',
                      color: '#8D6E63',
                      marginRight: wp(1)
                    }}
                    >View More</Text>
                    <Image source={require('../../Assets/Image/grn-arrow.png')} style={{ width: wp(2.5), height: wp(2.5) }} />
                  </View>
                </TouchableOpacity>
              </View>

              <GRN_Table />
            </View>


            {/* indents */}

            <View style={{ marginTop: wp(5), borderColor: '#757575', borderWidth: wp(0.1), borderRadius: wp(0.5), alignSelf: 'center', }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: wp(1), marginTop: wp(2) }}>
                <Text style={{
                  fontSize: wp(5),
                  fontWeight: '500',
                  color: '#757575',
                  letterSpacing: wp(0.1)
                }}>Indent </Text>
                <TouchableOpacity onPress={this.handleIndent}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: wp(1), right: wp(2) }}>
                    <Text style={{
                      fontSize: wp(3),
                      fontWeight: '500',
                      color: '#757575',
                      marginRight: wp(1)
                    }}
                    >View More</Text>
                    <Image source={require('../../Assets/Image/indent-arrow.png')} style={{ width: wp(2.5), height: wp(2.5) }} />
                  </View>
                </TouchableOpacity>
              </View>

              <Indents_Table />
            </View>

            {/* Reverse */}

            <View style={{ marginTop: wp(5), borderColor: '#197486', borderWidth: wp(0.1), borderRadius: wp(0.5), alignSelf: 'center', }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: wp(1), marginTop: wp(2) }}>
                <Text style={{
                  fontSize: wp(5),
                  fontWeight: '500',
                  color: '#197486',
                  letterSpacing: wp(0.1)
                }}>Reverse</Text>
                <TouchableOpacity onPress={this.handleReverse}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: wp(1), right: wp(2) }}>
                    <Text style={{
                      fontSize: wp(3),
                      fontWeight: '500',
                      color: '#197486',
                      marginRight: wp(1)
                    }}
                    >View More</Text>
                    <Image source={require('../../Assets/Image/reverse-arrow.png')} style={{ width: wp(2.5), height: wp(2.5) }} />
                  </View>
                </TouchableOpacity>
              </View>

              <Reverses_Table/>
            </View>

          </ScrollView>


        </View>
      </>
    )
  }
}


const Styles = StyleSheet.create({

  // Header slider bar //

  slider_box1: {
    backgroundColor: "#0288D1",
    height: wp(25),
    width: wp(35),
    margin: wp(1.2),
    borderRadius: wp(3),
    overflow: 'hidden',
  },
  box1: {
    backgroundColor: '#0288D1',
    height: wp(8),
    width: wp(70),
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
    borderBottomColor: 'white',
    borderBottomWidth: wp(0.4),
    justifyContent: 'center',
  },

  second_box: {
    
    backgroundColor: '355c6e',
    width: wp(70),
    flex: 1,
    justifyContent: 'center',
  },

  // 2 //.
  slider_box2: {
    backgroundColor: '#7986CB',
    height: wp(25),
    width: wp(35),
    margin: wp(1.2),
    borderRadius: wp(3),
    overflow: 'hidden'
  },
  box2: {
    backgroundColor: '#7986CB',
    height: wp(8),
    width: wp(70),
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
    borderBottomColor: 'white',
    borderBottomWidth: wp(0.4),
    justifyContent: 'center',
  },

  // 3//
  slider_box3: {
    backgroundColor: "#f186c0",
    height: wp(25),
    width: wp(35),
    margin: wp(1.2),
    borderRadius: wp(3),
    overflow: 'hidden'
  },
  box3: {
    backgroundColor: "#f186c0",
    height: wp(8),
    width: wp(70),
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
    borderBottomColor: 'white',
    borderBottomWidth: wp(0.4),
    justifyContent: 'center',
  },

  // 4 //
  slider_box4: {
    backgroundColor: "#EF9A9A",
    height: wp(25),
    width: wp(35),
    margin: wp(1.2),
    borderRadius: wp(3),
    overflow: 'hidden'
  },
  box4: {
    backgroundColor: "#EF9A9A",
    height: wp(8),
    width: wp(70),
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
    borderBottomColor: 'white',
    borderBottomWidth: wp(0.4),
    justifyContent: 'center',
  },

  // 5 //
  slider_box5: {
    backgroundColor: "#FFB74D",
    height: wp(25),
    width: wp(35),
    margin: wp(1.2),
    borderRadius: wp(3),
    overflow: 'hidden'
  },
  box5: {
    backgroundColor: '#FFB74D',
    height: wp(8),
    width: wp(70),
    borderTopLeftRadius: wp(3),
    borderTopRightRadius: wp(3),
    borderBottomColor: 'white',
    borderBottomWidth: wp(0.4),
    justifyContent: 'center',
  },



})

