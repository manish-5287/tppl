import { Text, View, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, Alert, FlatList, RefreshControl } from 'react-native'
import React, { Component } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Table, Row } from 'react-native-table-component';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';
import CustomLoader from '../../Component/loader/Loader';

export class Indent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Id', 'Contract name', 'Product', 'Issue By', 'Date'],
            rowData: [],
            currentPage: 0,
            rowsPerPage: 11,
            showProcessingLoader: false,
            searchIndent: '',
            searchName: '',
            contractName: [],
            isRefreshing: false

        };
    }

    componentDidMount() {
        this.handleIndent();
    };

    handleIndent = async () => {
        try {
            this.setState({ showProcessingLoader: true })
            const response = await makeRequest(BASE_URL + '/mobile/indent')
            const { success, message, indentDetails } = response;
            // console.log("Indent",response);

            if (success) {
                this.setState({ rowData: indentDetails, showProcessingLoader: false });

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

    renderRowData = (rowData, rowIndex) => {
        if (typeof rowData === 'object' && rowData !== null) {
            return (
                <Row
                    key={rowIndex}
                    data={Object.values(rowData)}
                    textStyle={styles.rowText}
                    style={[rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd]}
                    flexArr={[0, 3, 3, 2, 2]}
                />
            );
        } else {
            return (
                <Row
                    key={rowIndex}
                    data={rowData.map((item, index) => (
                        // Check if it's the column where you want TouchableOpacity
                        (index === 1 || index === 2) ?
                            <TouchableOpacity key={index} >
                                <Text style={styles.indentIdText}>{item}</Text>
                            </TouchableOpacity>
                            :
                            <Text key={index} style={styles.rowText}>{item}</Text>
                    ))}
                    style={rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd}
                    textStyle={styles.rowText}
                    flexArr={[0, 3, 3, 2, 2]} //Adjust the flexArr according to your column widths.
                />
            );
        }
    };

    handleSearch = async (searchName) => {
        try {
            const params = { workorderno: searchName };
            // console.log('Search', params);
            const response = await makeRequest(BASE_URL + '/mobile/searchcontractname', params);
            const { success, message, contractName } = response;

            if (success) {
                this.setState({ contractName: contractName });
            } else {
                this.setState({ contractName: [], errorMessage: message })
            }
        } catch (error) {
            console.log(error);
            this.setState({ contractName: [], errorMessage: 'Please try again' })
        }
    };


    handleProductPress = (item) => {
        const { contract_id } = item;
        // Navigate to the ProductDetailScreen with the selected item
        this.props.navigation.navigate('Search_Indent', { contract_id });

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
                    <Text>{this.state.errorMessage}</Text>
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
                    this.setState({ isRefreshing: false, searchName: '' });
                }, 100);
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
        const { showProcessingLoader } = this.state
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
                        style={{ marginBottom: wp(16) }}
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
                                placeholder='Search Work Order No.'
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
                                        <Text style={styles.noResultsText}>{this.state.errorMessage}</Text>
                                    </View>
                                )}
                            </View>
                        ) : null}

                        <Table style={{ marginTop: wp(3) }} borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
                            <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={[0, 3, 3, 2, 2]} />
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
        marginTop: wp(2),

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
        fontSize: wp(2.6),
        paddingHorizontal: wp(0.3),
        marginLeft: 4

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
        color: '#212529',
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


export default Indent
