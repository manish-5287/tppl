import { Text, View, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, Alert, FlatList, RefreshControl, Linking } from 'react-native'
import React, { Component } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Table, Row } from 'react-native-table-component';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';
import CustomLoader from '../../Component/loader/Loader';

export default class Indent_A extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Id', 'Contract name', 'Product', 'Issue By', 'Date'],
            rowData: [],
            currentPage: 0,
            rowsPerPage: 10,
            searchIndent: '',
            searchName: '',
            contractName: [],
            showProcessingLoader: false,
            isRefreshing: false,
            isLoading: false,
            errorMessage: '',
            indentId: '',
            contractId: ''


        };
    }

    componentDidMount() {
        this.handleIndent();
    };

    // pdf api by manish
    handlePressProductID = (indentId) => {

        this.setState({ indentId }, this._handlePressProductpdf); // Pass a reference to _handlePressProductpdf
    }

    _handlePressProductpdf = async () => {
        try {
            const { indentId } = this.state;
            if (!indentId) {
                console.log('No contract ID available to fetch PDF');
                return;
            }
            const params = { indent_id: indentId };
            console.log('papapapapapap', params);
            const response = await makeRequest(BASE_URL + '/mobile/indentpdf', params);
            const { success, message, pdfLink } = response;
            console.log('pdfpdfpdf', response);
            if (success) {
                console.log('PDF Link:', pdfLink);
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


    // pdf api by manish

    handlePressContract = (contractId) => {
        this.setState({ contractId }, this._handleContractPdf);
    };

    _handleContractPdf = async () => {
        try {
            const { contractId } = this.state;
            if (!contractId) {
                console.log('No contract ID available to fetch PDF');
                return;
            }

            const params = { contract_id: contractId };
            const response = await makeRequest(BASE_URL + '/mobile/contractpdf', params);
            const { success, message, pdfLink } = response;
            console.log('PDF response:', response);
            if (success) {
                console.log('PDF Link:', pdfLink);
                // Handle PDF link as needed, e.g., opening it
                Linking.openURL(pdfLink);
            } else {
                console.log('Error fetching PDF:', message);
            }
        } catch (error) {
            console.log('Error fetching PDF:', error);
        }
    };


    handleIndent = async () => {
        try {
            this.setState({ showProcessingLoader: true, isRefreshing: true });
            const response = await makeRequest(BASE_URL + '/mobile/indent');
            const { success, message, indentDetails } = response;

            if (success) {
                const modificationIndentDetails = indentDetails.map(({ indent_id, contact_name, product, issued_name, date, contract_id }) => ({
                    indent_id, contact_name, product, issued_name, date, contract_id
                }))

                this.setState({ rowData: modificationIndentDetails, showProcessingLoader: false, isRefreshing: false });

            } else {
                console.log(message);
                this.setState({ showProcessingLoader: false, isRefreshing: false });

            }
        } catch (error) {
            console.log(error);
            this.setState({ showProcessingLoader: false, isRefreshing: false });

        }
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


    handleSearch = async (searchName) => {
        try {
            if (searchName.length < 1) {
                this.setState({ contractName: [], currentPage: 0 }); // Clear the search results
                return;
            }
            const params = { workorderno: searchName };
            // console.log('Search', params);
            const response = await makeRequest(BASE_URL + '/mobile/searchcontractname', params);
            const { success, message, contractName } = response;

            if (success) {
                this.setState({ contractName: contractName, currentPage: 0 });
            } else {
                this.setState({ contractName: [], errorMessage: message })
            }
        } catch (error) {
            console.log(error);
            this.setState({ contractName: [] })
        }
    };


    handleProductPress = (item) => {
        const { contract_id } = item;
        // Navigate to the ProductDetailScreen with the selected item
        this.props.navigation.navigate('Search_A', { contract_id });

        // Stop refreshing and clear search term and results
        this.setState({ searchName: '', contractName: [] });
    };

    componentDidFocus = () => {
        this.setState({ searchName: '', contractName: [] }); // Clear the search term and results when screen is focused
    };

    renderProductItem = ({ item }) => {
        if (!item) {
            return (
                <View style={{ alignItems: 'center', paddingVertical: wp(2) }}>
                    <Text>NO Data</Text>
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

    _handleListRefreshing = async () => {
        try {
            // pull-to-refresh
            this.setState({ isRefreshing: true }, () => {
                // setTimeout with a delay of 1000 milliseconds (1 second)
                setTimeout(() => {
                    // updating list after the delay
                    this.handleIndent();
                    // resetting isRefreshing after the update
                    this.setState({ isRefreshing: false, searchName: '', currentPage: 0 });
                }, 2000);
            });
        } catch (error) {

        }
    }

    handleGoBackHome = () => {
        this.props.navigation.navigate('home');
    }

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
                        backgroundColor: '#EEEEEE',
                        height: wp(14),
                        borderRadius: wp(1),
                        overflow: 'hidden',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row'

                    }}>
                    <TouchableOpacity onPress={this.handleGoBackHome}>
                        <Image source={require('../../Assets/goback/contract.png')}
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
                        }}>Indent</Text>


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
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._handleListRefreshing}
                                colors={['#757575']}
                            />
                        }
                    >

                        <View style={styles.search}>
                            <TextInput
                                placeholder='Search Contract Number'
                                placeholderTextColor='#757575'
                                maxLength={25}
                                keyboardType='number-pad'
                                value={this.state.searchName}
                                onChangeText={(searchName) => {
                                    this.setState({ searchName });
                                    this.handleSearch(searchName);
                                }}
                                style={styles.search_text} />
                        </View>

                        {this.state.searchName.length > 0 ? (
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


                        <Table style={{ marginTop: wp(2) }} borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
                            <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={[0, 3, 3, 2, 2]} />
                            {slicedData.map((rowData, index) => (
                                <Row
                                    key={index}
                                    data={[
                                        <TouchableOpacity key="indent_id" onPress={() => this.handlePressProductID(rowData.indent_id)}>
                                            <Text style={[styles.Highlight, { lineHeight: 15 }]}>{rowData.indent_id}</Text>
                                        </TouchableOpacity>,
                                        <TouchableOpacity key='contract_name' onPress={() => this.handlePressContract(rowData.contract_id)}>
                                            <Text style={[styles.Highlight, { lineHeight: 15 }]}>{rowData.contact_name}</Text>
                                        </TouchableOpacity>,

                                        <Text style={[styles.rowText, { lineHeight: 15 }]}>{rowData.product}</Text>,
                                        <Text style={[styles.rowText, { lineHeight: 15 }]}>{rowData.issued_name}</Text>,
                                        <Text style={[styles.rowText, { lineHeight: 15 }]}>{rowData.date}</Text>

                                    ]}
                                    textStyle={styles.rowText}
                                    style={[index % 2 === 0 ? styles.rowEven : styles.rowOdd, { height: rowHeight }]}
                                    flexArr={[0, 3, 3, 2, 2]}
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
        backgroundColor: '#757575',
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
        backgroundColor: '#E0E0E0',
        width: wp(97),
        height: wp(10)
    },
    rowOdd: {
        backgroundColor: '#EEEEEE',
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
    indentIdText: {
        color: 'red', // Red color for the highlighted text
        textAlign: 'left',
        fontSize: wp(4),
        paddingHorizontal: wp(0.3),
        marginLeft: 4
    },

    search: {
        width: wp(97),
        height: wp(12),
        borderColor: '#757575',
        borderWidth: wp(0.3),
        borderRadius: wp(2),
        marginTop: wp(3),
        backgroundColor: '#EEEEEE',
        justifyContent: 'center',
        alignSelf: 'center'

    },
    search_text: {
        color: '#757575',
        fontSize: wp(3.5),
        marginLeft: wp(2),
        fontWeight: "500"
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: wp(4),
        paddingHorizontal: wp(3)
    },
    paginationText: {
        fontSize: wp(3.5),
        color: '#757575',
        fontWeight: "500"
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

});



