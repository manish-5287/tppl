import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, FlatList, RefreshControl, Linking } from 'react-native'
import React, { Component } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Table, Row } from 'react-native-table-component';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';
import CustomLoader from '../../Component/loader/Loader';

export default class Reverse_AA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Id', 'Contract name', 'Product', 'Received By', 'Date'],
            rowData: [],
            currentPage: 0,
            rowsPerPage: 10,
            searchReverse: '',
            searchName: '',
            contractName: [],
            showProcessingLoader: false,
            isRefreshing: false,
            isLoading: false,
            errorMessages: '',
            reverseId: '',
            contractId: ''

        };
    };

    componentDidMount() {
        this.handleReverse();
    };

    // changes by manish 

    handlePress = (cellData) => {
        this.setState({ reverseId: cellData }, () => {
            this._handleReversePdf();
        })
    };

    _handleReversePdf = async () => {
        try {
            const { reverseId } = this.state;
            const params = { reverse_id: reverseId };
            const response = await makeRequest(BASE_URL + '/mobile/reversepdf', params);
            const { success, message, pdfLink } = response;
            if (success) {
                this.setState({ cellData: pdfLink });
                Linking.openURL(pdfLink);

            } else {
                console.log('====================================');
                console.log(message);
                console.log('====================================');
            }
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
    };

    handleReverse = async () => {
        try {
            this.setState({ showProcessingLoader: true, isRefreshing: true })
            const response = await makeRequest(BASE_URL + '/mobile/reverse')
            const { success, message, reverseDetails } = response;
            // console.log("reverse",response);
            if (success) {
                const modifiedReverseDetails = reverseDetails.map(({ contract_id, ...rest }) => rest) // changes by manish
                this.setState({ rowData: modifiedReverseDetails, showProcessingLoader: false, isRefreshing: false }); // changes by manish 

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
    
    handlePressContract = (cellData) => {
        this.setState({ contractId: cellData }, () => {
            this._handleContractPdf();
        });
    };

    _handleContractPdf = async () => {
        try {
            const { contractId } = this.state;
            const params = { contract_id: contractId };
            console.log('papapapapapap', params);
            const response = await makeRequest(BASE_URL + '/mobile/contractpdf', params);
            const { success, message, pdfLink } = response;
            console.log('pdfpdfpdf', response);
            if (success) {
                this.setState({ cellData: pdfLink });
                Linking.openURL(pdfLink)
            } else {
                console.log(message);
            }
        } catch (error) {
            console.log(error);
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
            // console.log('searc', params);
            const response = await makeRequest(BASE_URL + '/mobile/searchcontractname', params);
            const { success, message, contractName } = response;
            // console.log(response);
            if (success) {
                this.setState({ contractName: contractName, currentPage: 0 });
            } else {
                this.setState({ contractName: [], errorMessages: message })
            }
        } catch (error) {
            console.log(error);
            this.setState({ contractName: [] })

        }
    };


    handleProductPress = (item) => {
        const { contract_id } = item;
        // Navigate to the ProductDetailScreen with the selected item
        this.props.navigation.navigate('Search_RevAA', { contract_id });

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
                    <Text>No Data</Text>
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

    _handleListRefresh = async () => {
        try {
            // pull-to-refresh
            this.setState({ isRefreshing: true }, () => {
                // setTimeout with a delay of 1000 milliseconds (1 second)
                setTimeout(() => {
                    // updating list after the delay
                    this.handleReverse();
                    // resetting isRefreshing after the update
                    this.setState({ isRefreshing: false, searchName: '', currentPage: 0 });
                }, 2000);
            });
        } catch (error) {
            console.log(error.message);
        }
    };

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
                        backgroundColor: '#f4fdfe',
                        height: wp(14),
                        borderRadius: wp(1),
                        overflow: 'hidden',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row'

                    }}>
                    <TouchableOpacity onPress={this.handleGoBackHome}>
                        <Image source={require('../../Assets/goback/reverse.png')}
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
                        }}>Reverse</Text>


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
                                colors={['#197486']}
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._handleListRefresh}
                            />
                        }
                    >
                        <View style={styles.search}>
                            <TextInput
                                placeholder='Search Contract Number'
                                placeholderTextColor='#197486'
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
                                    data={Object.values(rowData).map((cellData, cellIndex) => {
                                        if (cellIndex === 0) {
                                            return (
                                                <TouchableOpacity key={cellIndex} onPress={() => this.handlePress(cellData)}>
                                                    <Text style={[styles.Highlight, { lineHeight: 15 }]}>{cellData}</Text>
                                                </TouchableOpacity>
                                            );
                                        } else if (cellIndex === 1) {
                                            return (
                                                <TouchableOpacity key={cellIndex} onPress={() => this.handlePressContract(cellData)}>
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
        backgroundColor: '#197486',
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
        backgroundColor: '#d4eef4',
        width: wp(97),
        height: wp(10)
    },
    rowOdd: {
        backgroundColor: '#f4fdfe',
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
        color: '#197486',
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
        borderColor: '#197486',
        borderWidth: wp(0.3),
        borderRadius: wp(2),
        marginTop: wp(3),
        backgroundColor: '#f4fdfe',
        justifyContent: 'center',
        alignSelf: 'center'

    },
    search_text: {
        color: '#197486',
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

});

