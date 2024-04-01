import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, RefreshControl, ScrollView, FlatList, Linking } from 'react-native'
import React, { Component } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Table, Row } from 'react-native-table-component';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import CustomLoader from '../../Component/loader/Loader';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';


export class PO_AAA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Id', 'Date', 'Vendor', 'Qty', 'Amount', 'Delivery'],
            rowData: [],
            currentPage: 0,
            rowsPerPage: 10,
            searchPO: '',
            showProcessingLoader: false,
            isRefreshing: false,
            isLoading: false,
            purchaseorderId: '',
            poPrimary: '',
            isRevised: ''
        };
    };

    componentDidMount() {
        this.handlePO();
    };

    handlePO = async () => {
        try {
            this.setState({ showProcessingLoader: true, isRefreshing: true })
            const response = await makeRequest(BASE_URL + '/mobile/purchaseorder')
            const { success, message, poDetails } = response;
            // console.log("po",response); 
            if (success) {
                const modifiedPurchaseDetails = poDetails.map(({ poid, date, supplier, qty, amount, delivery  }) =>({
                    poid, date, supplier, qty, amount, delivery 
                })) // change by manish
                this.setState({ rowData: modifiedPurchaseDetails, showProcessingLoader: false, isRefreshing: false }); // changes by manish 
            } else {
                console.log(message);
                this.setState({ showProcessingLoader: false, isRefreshing: false });
            }
        } catch (error) {
            console.log(error);
            this.setState({ showProcessingLoader: false, isRefreshing: false });
        }
    };

    // pdf api by manish
    handlePurchase = (cellData) => {
        this.setState({
            purchaseorderId: cellData,
            poPrimary: cellData,
            isRevised: cellData
        }, () => {
            this.handlePurchaseId();
        });
    }
    handlePurchaseId = async () => {
        try {
            const { purchaseorderId, poPrimary, isRevised } = this.state;
            const params = {
                purchaseorder_id: purchaseorderId,
                po_primary: poPrimary,
                is_revised: isRevised
            };
            console.log('papapapapapap', params);
            const response = await makeRequest(BASE_URL + '/mobile/purchaseorderpdf', params);
            const { success, message, pdfLink } = response;
            console.log('pdfpdfpdf', response);
            if (success) {
                this.setState({ cellData: pdfLink });
                Linking.openURL(pdfLink)
            } else {
                console.log('====================================');
                console.log(message);
                console.log('====================================');
            }
        } catch (error) {
            console.log(error);
        }
    };


    handlePOSearch = async (searchPO) => {
        try {
            if (searchPO.length < 1) {
                // Reset search results and fetch all data
                this.setState({ rowData: [], currentPage: 0 });
                this.handlePO();
                return;
            }

            // Check if there are existing search results
            const { searchResults } = this.state;
            if (searchResults && searchResults.length > 0) {
                // Filter search results based on new search query
                const filteredResults = searchResults.filter(item =>
                    item.po_id.includes(searchPO)
                );
                this.setState({ rowData: filteredResults, currentPage: 0 });
            } else {
                // Fetch new data based on search query
                const params = { po_id: searchPO };
                const response = await makeRequest(BASE_URL + '/mobile/searchpurchaseorder', params);
                const { success, message, purchaseDetails } = response;
                if (success) {
                    this.setState({ rowData: purchaseDetails, currentPage: 0 });
                } else {
                    console.log(message);
                }
            }
        } catch (error) {
            console.log(error);
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

    _handleListRefreshing = async () => {
        try {
            // pull-to-refresh
            this.setState({ isRefreshing: true }, () => {
                // setTimeout with a delay of 1000 milliseconds (1 second)
                setTimeout(() => {
                    // updating list after the delay
                    this.handlePO();
                    // resetting isRefreshing after the update
                    this.setState({ isRefreshing: false, searchPO: '', currentPage: 0 });
                }, 2000);
            });
        } catch (error) {

        }
    }

    handleGoBackHome = () => {
        this.props.navigation.navigate('home');
    }

    render() {
        const { tableHead, rowData, currentPage, rowsPerPage, } = this.state;
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
                        backgroundColor: '#E1F5FE',
                        height: wp(14),
                        borderRadius: wp(1),
                        overflow: 'hidden',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row'

                    }}>
                    <TouchableOpacity onPress={this.handleGoBackHome}>
                        <Image source={require('../../Assets/goback/po.png')}
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
                        }}>Purchase Order</Text>


                    <Image source={require('../../Assets/applogo.png')}
                        style={{
                            width: wp(16),
                            height: wp(13),
                            resizeMode: 'contain',
                            marginRight: wp(2)
                        }} />


                </View>


                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            colors={['#039BE5']}
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._handleListRefreshing}
                        />
                    }
                    style={styles.container}>

                    <View style={styles.search}>
                        <TextInput
                            placeholder='Search Purchase ID'
                            placeholderTextColor='#039BE5'
                            maxLength={25}
                            keyboardType='number-pad'
                            value={this.state.searchPO}
                            onChangeText={(searchPO) => {
                                this.setState({ searchPO });
                                this.handlePOSearch(searchPO);
                            }}
                            style={styles.search_text} />
                    </View>

                    <Table style={{ marginTop: wp(2) }} borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
                        <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={[0, 2, 3, 2, 2, 2]} />
                        {slicedData.map((rowData, index) => (
                            <Row
                                key={index}
                                data={Object.values(rowData).map((cellData, cellIndex) => {
                                    if (cellIndex === 0) {
                                        return (
                                            <TouchableOpacity key={cellIndex} onPress={() => this.handlePurchase(cellData)}>
                                                <Text style={[styles.Highlight, { lineHeight: 15 }]}>{cellData}</Text>
                                            </TouchableOpacity>
                                        );
                                    }
                                    else {
                                        return <Text style={[styles.rowText, { lineHeight: 15 }]}>{cellData}</Text>;
                                    }
                                })}
                                textStyle={styles.rowText}
                                style={[index % 2 === 0 ? styles.rowEven : styles.rowOdd, { height: rowHeight }]}
                                flexArr={[0, 2, 3, 2, 2, 2]}
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
        backgroundColor: '#039BE5',
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
        backgroundColor: '#B3E5FC',
        width: wp(97),
        height: wp(10)
    },
    rowOdd: {
        backgroundColor: '#E1F5FE',
        width: wp(97),
        height: wp(10)
    },
    rowText: {
        color: '#212529',
        textAlign: 'left',
        fontSize: wp(2.5),
        paddingHorizontal: wp(0.3),
        marginLeft: 4,
        fontWeight: '400'
    },
    Highlight: {
        color: 'red',
        textAlign: 'left',
        fontSize: wp(2.5),
        fontWeight: '500',
        paddingHorizontal: wp(0.3),
        marginLeft: 4,

    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: wp(4),
        paddingHorizontal: wp(3)
    },
    paginationText: {
        fontSize: wp(3.5),
        color: '#039BE5',
        fontWeight: '500'
    },

    Contract_name: {
        color: '#212529',
        fontSize: wp(4),
        fontWeight: '500'
    },
    search: {
        width: wp(97),
        height: wp(12),
        borderColor: '#039BE5',
        borderWidth: wp(0.3),
        borderRadius: wp(2),
        marginTop: wp(3),
        backgroundColor: '#E1F5FE',
        justifyContent: 'center',
        alignSelf: 'center'

    },
    search_text: {
        color: '#039BE5',
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

});

export default PO_AAA