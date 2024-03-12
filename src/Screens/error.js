import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { SearchBar } from "react-native-elements";
 


const Item = ({ title }) => {
  return (
    <View style={styles.item}>
      <Text>{title}</Text>
    </View>
  );
};

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      error: null,
      searchValue: "",
    };
    this.arrayholder = DATA;
  }

  searchFunction = (text) => {
    const updatedData = this.arrayholder.filter((item) => {
      const item_data = `${item.title.toUpperCase()}`;
      const text_data = text.toUpperCase();
      return item_data.indexOf(text_data) > -1;
    });
    this.setState({ data: updatedData, searchValue: text });
  };

  renderItem = ({ item }) => <Item title={item.title} />;
  render() {
    return (
      <View style={styles.container}>
        <SearchBar
          placeholder="Search Here..."
          lightTheme
          round
          value={this.state.searchValue}
          onChangeText={(text) => this.searchFunction(text)}
          autoCorrect={false}
        />
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }
}

export default Search;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 2,
  },
  item: {
    backgroundColor: "#f5f520",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});





import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Modal } from 'react-native'
import React, { Component } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Table, Row } from 'react-native-table-component';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import { SearchBar } from 'react-native-elements';





export class Contract extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Title', 'Supplier Name', '	Cost', ' Date'],
            rowData: [],
            currentPage: 0,
            rowsPerPage: 11,
            isPopoverVisible: false,
            popoverContent: "",
            data: [],
            Searchworkorderno: '',
        };
        this.arrayholder = [];
    };


    componentDidMount() {
        this.handleContract();
        this.handleSearch();
    };

    handleContract = async () => {
        try {
            const response = await makeRequest(BASE_URL + '/mobile/contract')
            console.log("dsfhttt", response);
            const { success, message, contractDetails } = response;
            if (success) {
                this.setState({ rowData: contractDetails });
                this.arrayholder = contractDetails;
            } else {
                Alert.alert(message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleSearch = async () => {
        try {
            const params = { workorderno:Searchworkorderno }
            console.log(params);
            const response = await makeRequest(BASE_URL + '/mobile/searchcontractname', params)
            const { success, message } = response
            console.log('fdgfdgdfgdf', response);
            if (success) {
                this.setState({Searchworkorderno:'' })

            } else {
                console.log(message);

            }

        } catch (error) {
            console.log(error);
        }
    }

    updateSearch = (Searchworkorderno) => {
        const { rowData } = this.state;
        const filteredData = rowData.filter(item =>
            item['Title'].toLowerCase().includes(Searchworkorderno.toLowerCase())
        );
        this.setState({ search, rowData: filteredData });
    };


    renderRowData = (rowData, rowIndex) => {
        if (typeof rowData === 'object' && rowData !== null) {
            return (
                <Row
                    key={rowIndex}
                    data={Object.values(rowData)}
                    textStyle={styles.rowText}
                    style={[rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd]}
                    flexArr={[3, 3, 2, 2]}
                />
            );
        } else if (Array.isArray(rowData)) {
            let maxLines = 2;
            rowData.forEach(cellData => {
                const lines = Math.ceil(cellData.length / 20);
                if (lines > maxLines) {
                    maxLines = lines;
                }
            });
            const rowHeight = maxLines * 20; // Assuming font size of 25

            return (
                <Row
                    key={rowIndex}
                    data={rowData.map((cellData, columnIndex) => {
                        if (columnIndex === 0) {
                            return (
                                <TouchableOpacity key={columnIndex} onPress={() => this.handleCellPress(cellData)}>
                                    <Text style={[styles.rowText1, { lineHeight: 14, color: 'red' }]}>{cellData}</Text>
                                </TouchableOpacity>
                            );
                        } else {
                            return <Text key={columnIndex} style={[styles.rowText, { lineHeight: 14 }]}>{cellData}</Text>;
                        }
                    })}
                    textStyle={styles.rowText}
                    style={[rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd, { height: rowHeight }]}
                    flexArr={[3, 3, 2, 2]}
                />
            );
        }
    };

    handleCellPress = (cellData) => {
        // Set the content of the popover based on the pressed cell data
        this.setState({
            isPopoverVisible: true,
            popoverContent: cellData
        });
    };

    closePopover = () => {
        // Close the popover
        this.setState({
            isPopoverVisible: false,
            popoverContent: ""
        });
    };

    nextPage = () => {
        const { currentPage } = this.state;
        this.setState({ currentPage: currentPage + 1 });
    };

    prevPage = () => {
        const { currentPage } = this.state;
        if (currentPage > 0) {
            this.setState({ currentPage: currentPage - 1 });
        }
    };

    renderPopoverContent = () => {
        // Render the content of the popover
        return (
            <View style={styles.popoverContent}>
                <Text>{this.state.popoverContent}</Text>
                <TouchableOpacity style={{ marginTop: wp(10) }} onPress={this.closePopover}>
                    <Text>Close</Text>
                </TouchableOpacity>
            </View>
        );
    };


    // Function to update the search state
    updateSearch = (Searchworkorderno) => {
        this.setState({ Searchworkorderno });
    };

    render() {
        const { tableHead, rowData, currentPage, rowsPerPage,Searchworkorderno } = this.state;
        const startIndex = currentPage * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, rowData.length); // Calculate end index while considering the last page
        const slicedData = rowData.slice(startIndex, endIndex);


        return (
            <>
                <View
                    style={{
                        backgroundColor: 'white',
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
                    <Text
                        style={{
                            color: '#333',
                            fontSize: wp(5),
                            fontWeight: '500',
                            marginRight: wp(40),
                            letterSpacing: wp(0.4),
                        }}>Contract</Text>

                </View>

                <View style={styles.container}>
                    <ScrollView style={{ marginBottom: wp(16) }} showsVerticalScrollIndicator={false}>
                        {/* <View style={styles.search}>
                            <TextInput placeholder='Enter Work Order Number' placeholderTextColor='#212529' maxLength={25} style={styles.search_text} />
                        </View> */}

                        <SearchBar
                            keyboardType='number-pad'
                            placeholder="Search"
                            onChangeText={this.updateSearch}
                            value={Searchworkorderno}
                            lightTheme
                            round
                            containerStyle={styles.search}
                            inputContainerStyle={{ backgroundColor: 'white', height: wp(8) }}
                        />

                        <Table style={{ marginTop: wp(3) }} borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
                            <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={[3, 3, 2, 2,]} />
                            {slicedData.map((rowData, index) => this.renderRowData(rowData, index))}
                        </Table>


                        <View style={styles.pagination}>
                            <TouchableOpacity onPress={this.prevPage} disabled={currentPage === 0}>
                                <Text style={styles.paginationText}>Previous</Text>
                            </TouchableOpacity>
                            <Text style={styles.paginationText}>Page {currentPage + 1}</Text>
                            <Text style={styles.paginationText}>Showing {startIndex + 1} - {endIndex} of {rowData.length} records</Text>
                            <TouchableOpacity onPress={this.nextPage} disabled={endIndex >= rowData.length}>
                                <Text style={styles.paginationText}>Next</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Popover */}
                        <Modal
                            animationType='fade'
                            transparent={true}
                            visible={this.state.isPopoverVisible}
                            onRequestClose={this.closePopover}

                        >
                            <View style={styles.popoverContainer}>
                                {this.renderPopoverContent()}
                            </View>
                        </Modal>
                    </ScrollView>
                </View>
            </>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        marginTop: wp(2),

    },
    head: {
        backgroundColor: '#212529',
        width: wp(97),
        height: wp(12)
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontSize: wp(3),
        fontWeight: '500'
    },
    rowEven: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        width: wp(97),
        height: wp(10)
    },
    rowOdd: {
        backgroundColor: 'white',
        width: wp(97),
        height: wp(10)
    },
    rowText: {
        color: '#212529',
        textAlign: 'left',
        fontSize: wp(2.6),
        paddingHorizontal: wp(0.3),
        marginLeft: 4
    },

    rowText1: {
        color: 'red',
        textAlign: 'left',
        fontSize: wp(2.6),
        paddingHorizontal: wp(0.3),
        marginLeft: 4
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: wp(4),
        paddingHorizontal: wp(3)
    },
    paginationText: {
        fontSize: wp(3.5),
        color: '#212529',
        fontWeight: "500"
    },

    Contract_name: {
        color: '#212529',
        fontSize: wp(4),
        fontWeight: '500'
    },
    search: {
        width: wp(97),
        borderColor: 'rgba(0,0,0,0.05)',
        borderWidth: wp(0.5),
        borderRadius: wp(1.5),
        marginTop: wp(2),
        backgroundColor: 'white',
        justifyContent: 'center',
        alignSelf: 'center'

    },
    search_text: {
        color: '#212529',
        fontSize: wp(3.5),
        marginLeft: wp(2),
        fontWeight: "500"
    },
    popoverContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',

    },
    popoverContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: wp(60),
        height: wp(60)
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    searchContainer: {
        backgroundColor: 'blue',
        marginTop: wp(5),
        widthL: wp(30),
        height: wp(10)
    },
    inputContainer: {
        backgroundColor: '#cdcdcb',
        borderRadius: wp(4),
        height: wp(12),
    },

});

export default Contract




import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "./src/Screens/Home/Home_screen";
import PO from "./src/Screens/PO/PO";
import Production from "./src/Screens/Production/Production";
import GRN from "./src/Screens/GRN/GRN";
import Contract from "./src/Screens/Contract/Contract";
import Login from "./src/Screens/Login_Screen/Login";
import Indent_Table from "./src/Screens/Indent/Indent_Table";
import Reverses_Table from "./src/Screens/Reverses/Reverses_Table";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { Image } from "react-native";
import Supllier_table from "./src/Screens/Supplier/Supllier_table";
import Stock_table from "./src/Screens/Stock/Stock";
import SplashScreen from "./src/Screens/Splash/Splash_Screen";
import Indents from "./src/Component/Table/Indents";
import VendorReport from "./src/Screens/Supplier/VendorReport";
import Search from "./src/Screens/error";






  //   return (
  //     <NavigationContainer>
  //       <Stack.Navigator screenOptions={{ headerShown: false }}>
  //         <Stack.Screen name="splash" component={SplashScreen} />
  //         <Stack.Screen name="login" component={Login} />
  //         <Stack.Screen name="PO" component={PO} />
  //         <Stack.Screen name="Production" component={Production} />
  //         <Stack.Screen name="GRN" component={GRN} />
  //         <Stack.Screen name="Contract" component={Contract} />
  //         <Stack.Screen name="Indent" component={Indent_Table} />
  //         <Stack.Screen name="Reverse" component={Reverses_Table} />
  //         <Stack.Screen name="report" component={VendorReport} />
  //         <Stack.Screen name="mytab" component={MyTab} />

  //       </Stack.Navigator>
  //     </NavigationContainer>
  //   )
  // }

  // const Tab = createBottomTabNavigator()
  // function MyTab() {
  //   return (
  //     <Tab.Navigator
  //       screenOptions={{
  //         headerShown: false,
  //         tabBarStyle: { alignItems: 'center' },
  //         tabBarActiveTintColor: '#ff5d5d',
  //         tabBarInactiveTintColor: "#0477a4",
  //         tabBarLabelStyle: {
  //           marginTop: wp(-2),
  //           fontSize: wp(3.2),
  //           fontWeight: '500',
  //         },
  //       }}>
  //       <Tab.Screen name='home' component={Dashboard} options={{
  //         tabBarLabel: 'Home',
  //         tabBarIcon: ({ size, focused }) => (
  //           <FontAwesome name="home" size={size} color={focused ? '#ff5d5d' : '#0477a4'} />
  //         ),

  //       }} />


  //       <Tab.Screen name='po' component={PO} options={{
  //         tabBarLabel: 'P.O',
  //         tabBarIcon: ({ size, focused }) => (
  //           <Image
  //             source={focused ? require('../tppl/src/Assets/bottom_icon/production.png') : require('../tppl/src/Assets/bottom_icon/production.png')}
  //             style={[{ width: wp(6), height: wp(6), tintColor: '#0477a4' }, focused && { tintColor: '#ff5d5d' }]}
  //           />)
  //       }} />


  //       <Tab.Screen name='grn' component={GRN} options={{
  //         tabBarLabel: 'GRN',
  //         tabBarIcon: ({ size, focused }) => (
  //           <Image
  //             source={focused ? require('../tppl/src/Assets/bottom_icon/boxes.png') : require('../tppl/src/Assets/bottom_icon/boxes.png')}
  //             style={[{ width: wp(6), height: wp(6), tintColor: '#0477a4' }, focused && { tintColor: '#ff5d5d' }]}
  //           />
  //         ),
  //       }} />

  //       <Tab.Screen name='stock' component={Stock_table} options={{
  //         tabBarLabel: 'stock',

  //         tabBarIcon: ({ size, focused }) => (
  //           <MaterialCommunityIcons name="store" size={size} color={focused ? '#ff5d5d' : '#0477a4'} />
  //         ),
  //       }} />


  //       <Tab.Screen name='supplier' component={Supllier_table} options={{
  //         tabBarLabel: 'Supplier',
  //         tabBarIcon: ({ size, focused }) => (
  //           <MaterialCommunityIcons name="truck-fast" size={size} color={focused ? '#ff5d5d' : '#0477a4'} />
  //         ),
  //       }} />

  //       <Tab.Screen name='indent' component={Indent_Table} options={{
  //         tabBarLabel: 'Indent',
  //         tabBarIcon: ({ focused, size }) => (
  //           <Image
  //             source={focused ? require('../tppl/src/Assets/bottom_icon/playlist.png') : require('../tppl/src/Assets/bottom_icon/playlist.png')}
  //             style={[{ width: wp(6), height: wp(6), tintColor: '#0477a4' }, focused && { tintColor: '#ff5d5d' }]}
  //           />
  //         ),
  //       }} />

  //       <Tab.Screen name='Reverse' component={Reverses_Table} options={{
  //         tabBarLabel: 'Reverse',
  //         tabBarIcon: ({ focused, size }) => (
  //           <Image
  //             source={focused ? require('../tppl/src/Assets/bottom_icon/reverse-logistic.png') : require('../tppl/src/Assets/bottom_icon/reverse-logistic.png')}
  //             style={[{ width: wp(6), height: wp(6), tintColor: '#0477a4' }, focused && { tintColor: '#ff5d5d' }]}
  //           />
  //         ),
  //       }} />



  //     </Tab.Navigator>

  //   )











