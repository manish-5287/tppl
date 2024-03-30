import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Modal, Alert, RefreshControl, FlatList } from 'react-native'
import React, { Component } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Table, Row } from 'react-native-table-component';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';
import CustomLoader from '../../Component/loader/Loader';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { showToast } from '../../Component/tost/ShowToast';

export class VendorReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Date', 'GRN No.', 'PO No.', 'Bill No.', 'Vendor', 'Amount'],
            rowData: [],
            currentPage: 0,
            rowsPerPage: 10,
            isPopoverVisible: false,
            popoverContent: "",
            searchName: '',
            contractName: [],
            isDateTimePickerVisible: false,
            showFlatList: false, // Add this state variable
            selectedDateFrom: '',
            selectedDateTo: '',
            pickerType: '',
            vendorid: '',
            showProcessingLoader: false,
            isRefreshing: false,
            isLoading: false,
            errorMessage: '',


        };
    }

    componentDidMount() {
        this.handleVendorReport();
    };

    handleVendorReport = async () => {
        try {
            this.setState({ showProcessingLoader: true, isRefreshing: true });
            const response = await makeRequest(BASE_URL + '/mobile/vendorsreport')
            // console.log("VendorReport",response);
            const { success, message, vendorTrack } = response;
            if (success) {
                this.setState({ rowData: vendorTrack, showProcessingLoader: false, isRefreshing: false });
            } else {
                console.log(message);
                this.setState({ showProcessingLoader: false, isRefreshing: false });

            }
        } catch (error) {
            console.log(error);
            this.setState({ showProcessingLoader: false, isRefreshing: false });

        }
    }


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



    _handleListRefresh = async () => {
        try {
            // pull-to-refresh
            this.setState({ isRefreshing: true }, () => {
                // setTimeout with a delay of 1000 milliseconds (1 second)
                setTimeout(() => {
                    // updating list after the delay
                    this.handleVendorReport();
                    // resetting isRefreshing after the update
                    this.setState({
                        isRefreshing: false,
                        selectedDateFrom: '',
                        selectedDateTo: '',
                        searchName: '',
                        currentPage: 0
                    });
                }, 2000);
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    handleGoBackHome = () => {
        this.props.navigation.navigate('supplier');
    };

    // show search venfor //

    _handleShowSearch = async () => {
        try {

            const { selectedDateFrom, selectedDateTo, vendorid } = this.state;
            const params = {
                vendor_id: vendorid,
                date_from: selectedDateFrom,
                date_to: selectedDateTo
            }
            console.log("showVendor", params);
            const response = await makeRequest(BASE_URL + '/mobile/searchvendorsreport', params)
            const { success, message, vendorsData } = response
            if (success) {
                this.setState({ rowData: vendorsData })
                showToast(message);
            } else {
                showToast(message);

            }
        } catch (error) {
            console.log(error);
            showToast(message);



        }
    }

    // search vendor //

    handleSearch = async (searchName) => {
        try {
            if (searchName.length < 1) {
                this.setState({ contractName: [] }); // Clear the search results
                return;
            }
            const params = {
                vendorname: searchName
            };
            console.log('search', params);

            const response = await makeRequest(BASE_URL + '/mobile/searchvendorname', params);
            const { success, message, vendorName } = response;
            if (success) {
                this.setState({ contractName: vendorName, showFlatList: true, searchDataFound: true });
            } else {
                this.setState({ contractName: [], errorMessage: message, showFlatList: true, searchDataFound: false })
            }
        } catch (error) {
            console.log(error);
            this.setState({ contractName: [], showFlatList: false, searchDataFound: false })
        }
    };

    handleProductPress = (item) => {
        const { name, vendor_id } = item;
        console.log(vendor_id);
        // Update searchName state with the selected item's name
        this.setState({ searchName: name, vendorid: vendor_id });
        // Stop refreshing and clear search term and results
        this.setState({ contractName: [], showFlatList: false });
    };

    componentDidFocus = () => {
        this.setState({ searchName: '', contractName: [] }); // Clear the search term and results when screen is focused
    };

    renderProductItem = ({ item }) => {
        if (!item) {
            return (
                <View style={{ alignItems: 'center', paddingVertical: wp(2) }}>
                    <Text>No Data </Text>
                </View>
            );
        }

        return (
            <TouchableOpacity onPress={() => this.handleProductPress(item)}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                    <Text style={{ color: 'black', fontWeight: '500', fontSize: wp(3), marginBottom: wp(2) }}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    // date time picker 

    _showDateTimePicker = (type) => this.setState({ isDateTimePickerVisible: true, pickerType: type });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = date => {
        const day = date.getDate();
        const month = date.getMonth() + 1; // Adding 1 to month because it's zero-based
        const year = date.getFullYear();

        const formattedDate = `${day}-${month}-${year}`;

        if (this.state.pickerType === 'from') {
            this.setState({ selectedDateFrom: formattedDate });
        } else if (this.state.pickerType === 'to') {
            this.setState({ selectedDateTo: formattedDate });
        }
        this._hideDateTimePicker();
    };

    render() {
        const { tableHead, rowData, currentPage, rowsPerPage } = this.state;
        const startIndex = currentPage * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, rowData.length); // Calculate end index while considering the last page
        const slicedData = rowData.slice(startIndex, endIndex);
        if (this.state.isLoading) {
            return <CustomLoader />;
        }
        const { showProcessingLoader } = this.state;

                // Calculate the maximum number of lines for each cell in a row
                let maxLines = 2;
                rowData.forEach(cellData => {
                    const lines = Math.ceil(cellData.length / 20); // Assuming each line has 20 characters
                    if (lines > maxLines) {
                        maxLines = lines;
                    }
                });
        
                // Calculate row height based on the maximum number of lines and font size
                const rowHeight = maxLines * 25; // Assuming font size of 25

        return (
            <>
                <View
                    style={{
                        backgroundColor: '#E0F7FA',
                        height: wp(14),
                        borderRadius: wp(1),
                        overflow: 'hidden',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row'

                    }}>
                    <TouchableOpacity onPress={this.handleGoBackHome}>
                        <Image source={require('../../Assets/goback/supplier.png')}
                            style={{
                                width: wp(8),
                                height: wp(8),
                                marginLeft: wp(2)
                            }} />
                    </TouchableOpacity>


                    <Text
                        style={{
                            color: '#333',
                            fontSize: wp(5),
                            fontWeight: '500',
                            letterSpacing: wp(0.4),
                            textTransform: 'uppercase'
                        }}>Vendor Report</Text>


                    <Image source={require('../../Assets/applogo.png')}
                        style={{
                            width: wp(16),
                            height: wp(13),
                            resizeMode: 'contain',
                            marginRight: wp(2)
                        }} />

                </View>

                <View style={styles.container}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        style={{ marginBottom: wp(16) }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                colors={['#00838F']}
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._handleListRefresh}
                            />
                        }
                    >
                        <View style={styles.search}>
                            <TextInput
                                placeholder="Search Vendor"
                                placeholderTextColor='#00838F'
                                maxLength={25}
                                keyboardType='name-phone-pad'
                                value={this.state.searchName}
                                onChangeText={(searchName) => {
                                    this.setState({ searchName });
                                    this.handleSearch(searchName);
                                }}
                                style={styles.search_text} />
                        </View>
                        {this.state.showFlatList && this.state.searchName.length > 0 ? (
                            <View style={styles.searchResultsContainer}>
                                {this.state.contractName.length > 0 ? (
                                    <FlatList
                                        data={this.state.contractName}
                                        renderItem={this.renderProductItem}
                                        // keyExtractor={(item) => item.id.toString()}
                                        style={styles.searchResultsList}
                                    />
                                ) : (
                                    <View style={styles.noResultsContainer}>
                                        <Text style={styles.noResultsText}>No Data Found</Text>
                                    </View>
                                )}
                            </View>
                        ) : null}



                        {/* Date Time picker View */}
                        <View style={styles.DateTimepicker_Box}>


                            <DateTimePicker
                                mode='date'
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker}
                            />

                            <View style={styles.Date_From}>
                                <TouchableOpacity onPress={() => this._showDateTimePicker('from')}>
                                    <Text style={styles.Date_text}>
                                        {this.state.selectedDateFrom ? this.state.selectedDateFrom : 'Select Date from'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.Date_to}>
                                <TouchableOpacity onPress={() => this._showDateTimePicker('to')}>
                                    <Text style={styles.Date_text}>
                                        {this.state.selectedDateTo ? this.state.selectedDateTo : 'Select Date to'}
                                    </Text>
                                </TouchableOpacity>
                            </View>


                            <TouchableOpacity
                                onPress={this._handleShowSearch}
                                style={{
                                    width: wp(20),
                                    height: wp(9),
                                    borderRadius: wp(2),
                                    backgroundColor: '#00838F',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Text style={{
                                    fontSize: wp(3.7),
                                    fontWeight: '500',
                                    color: 'white',
                                }}>Search</Text>
                            </TouchableOpacity>


                        </View>



                        <Table style={{ marginTop: wp(3) }} borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
                            <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={[2, 0, 0, 0, 3, 3]} />
                            {slicedData.map((rowData, index) => (
                                <Row
                                    key={index}
                                    data={Object.values(rowData)}
                                    textStyle={styles.rowText}
                                    style={[index % 2 === 0 ? styles.rowEven : styles.rowOdd, { height: rowHeight }]}
                                    flexArr={[2, 0, 0, 0, 3, 3]}
                                />
                            ))}
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


                    </ScrollView>
                </View>
                {showProcessingLoader && <ProcessingLoader />}
            </>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
    },
    head: {
        backgroundColor: '#00838F',
        width: wp(97),
        height: wp(12)
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontSize: wp(3),
        fontWeight: '500',

    },
    rowEven: {
        backgroundColor: '#80DEEA',
        width: wp(97),
        height: wp(10)
    },
    rowOdd: {
        backgroundColor: '#E0F7FA',
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
        textAlign: 'center',
        fontSize: wp(2.6),
        // Optional: add underline to indicate touchability
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: wp(4),
        paddingHorizontal: wp(3)
    },
    paginationText: {
        fontSize: wp(3.5),
        color: '#00838F',
        fontWeight: '500'
    },

    Contract_name: {
        color: '#00838F',
        fontSize: wp(4),
        fontWeight: '500'
    },
    search: {
        width: wp(97),
        height: wp(12),
        borderColor: '#00838F',
        borderWidth: wp(0.3),
        borderRadius: wp(2),
        marginTop: wp(3),
        backgroundColor: '#E0F7FA',
        justifyContent: 'center',
        alignSelf: 'center'

    },
    search_text: {
        color: '#00838F',
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

    searchResultsContainer: {
        position: 'absolute',
        top: hp(8), // Adjust the top position as needed
        left: wp(2), // Adjust the left position as needed
        right: wp(2), // Adjust the right position as needed
        backgroundColor: '#fff',
        borderRadius: wp(2),
        elevation: 3,
        zIndex: 999, // Ensure the search results view is displayed above other content
    },
    searchResultsList: {
        maxHeight: hp(30), // Adjust the max height as needed
        borderRadius: wp(2),
        padding: wp(2),
    },

    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: wp(2),
    },
    noResultsText: {
        fontSize: wp(3),
        fontWeight: 'bold',
    },



    // Date time picker style //
    DateTimepicker_Box: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: wp(3),
        alignContent: "center"
    },
    Date_From: {
        width: wp(35),
        height: wp(9),
        borderColor: '#00838F',
        borderWidth: wp(0.3),
        borderRadius: wp(2),
        backgroundColor: '#E0F7FA',
        justifyContent: 'center'
    },
    Date_text: {
        color: '#00838F',
        fontSize: wp(3),
        fontWeight: "500",
        width: wp(35),
        marginLeft: wp(2)

    },

    Date_to: {
        width: wp(35),
        height: wp(9),
        borderColor: '#00838F',
        borderWidth: wp(0.3),
        borderRadius: wp(2),
        backgroundColor: '#E0F7FA',
        justifyContent: 'center'

    },







});
export default VendorReport