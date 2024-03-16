import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Modal, Alert, FlatList, Keyboard, TouchableWithoutFeedback, RefreshControl } from 'react-native'
import React, { Component } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Table, Row } from 'react-native-table-component';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import CustomLoader from '../../Component/loader/Loader';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';




export class Production extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Id', 'Date', 'Contract Name', 'Product', 'Plan Qty', 'Prep Qty'],
            rowData: [],
            currentPage: 0,
            rowsPerPage: 15,
            isPopoverVisible: false,
            popoverContent: "",
            searchName: '',
            contractName: [],
            showProcessingLoader: false,
            isRefreshing: false
        };
    };

    componentDidMount() {
        this.handleProduction();

    };

    handleProduction = async () => {
        try {
            this.setState({ showProcessingLoader: true })
            const response = await makeRequest(BASE_URL + '/mobile/production')
            const { success, message, productionDetails } = response;
            // console.log("production",response);
            if (success) {
                this.setState({ rowData: productionDetails, showProcessingLoader: false });

            } else {
                console.log(message);

            }
        } catch (error) {
            console.log(error);
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
                    flexArr={[0, 2, 3, 3, 1, 1]}
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
        }

        const rowHeight = maxLines * 25; // Assuming font size of 25

        return (
            <Row
                key={rowIndex}
                data={rowData.map((cellData, columnIndex) => {
                    if (columnIndex === 0) {
                        return (
                            <TouchableOpacity key={columnIndex} onPress={() => this.handleCellPress(cellData)}>
                                <Text style={[styles.rowText1, { lineHeight: 15 }]}>{cellData}</Text>
                            </TouchableOpacity>
                        );
                    } else if (columnIndex === 2) {
                        return (
                            <TouchableOpacity key={columnIndex} onPress={() => this.handleCellPress1(cellData)}>
                                <Text style={[styles.rowText2, { lineHeight: 15 }]}>{cellData}</Text>
                            </TouchableOpacity>
                        );
                    } else {
                        return <Text key={columnIndex} style={[styles.rowText, { lineHeight: 12 }]}>{cellData}</Text>;
                    }
                })}
                textStyle={styles.rowText}
                style={[rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd, { height: rowHeight }]}
                flexArr={[0, 2, 3, 3, 1, 1]}
            />
        );
    };

    handleCellPress = (cellData) => {
        // Set the content of the popover based on the pressed cell data
        this.setState({
            isPopoverVisible: true,
            popoverContent: cellData
        });
    };

    handleCellPress1 = (cellData) => {
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

    renderPopoverContent1 = () => {
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

    handleSearch = async (searchName) => {
        try {
            const params = { workorderno: searchName };
            // console.log(' Search', params);
            const response = await makeRequest(BASE_URL + '/mobile/searchcontractname', params);
            const { success, message, contractName } = response;
            // console.log(response);
            if (success) {
                this.setState({ contractName: contractName });
            } else {
                this.setState({ contractName: [], errorMessage: message })
            }
        } catch (error) {
            console.log(error);
            this.setState({ contractName: [], errorMessage: 'please try again' })
        }
    };


    handleProductPress = (item) => {
        const { contract_id } = item;
        // Navigate to the ProductDetailScreen with the selected item
        this.props.navigation.navigate('Search_Product', { contract_id });

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

    _handleListRefresh = async () => {
        try {
            // pull-to-refresh
            this.setState({ isRefreshing: true }, () => {
                // setTimeout with a delay of 1000 milliseconds (1 second)
                setTimeout(() => {
                    // updating list after the delay
                    this.handleProduction();
                    // resetting isRefreshing after the update
                    this.setState({ isRefreshing: false , searchName: ''});
                }, 100);
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
        const { showProcessingLoader } = this.state

        return (
            <>

                <View
                    style={{
                        backgroundColor: '#f3faf7',
                        height: wp(14),
                        borderRadius: wp(1),
                        overflow: 'hidden',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row'

                    }}>
                    <TouchableOpacity onPress={this.handleGoBackHome}>
                        <Image source={require('../../Assets/goback/prod.png')}
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
                        }}>Production order</Text>


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
                                onRefresh={this._handleListRefresh}
                                colors={['#40856f']}
                            />
                        }

                    >
                        <View style={styles.search}>
                            <TextInput
                                placeholder='Search Work Order No.'
                                placeholderTextColor='#40856f'
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
                            <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={[0, 2, 3, 3, 1, 1]} />
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

                        {/* Popover */}
                        <Modal
                            animationType='fade'
                            transparent={true}
                            visible={this.state.isPopoverVisible}
                            onRequestClose={this.closePopover}

                        >
                            <View style={styles.popoverContainer}>
                                {this.renderPopoverContent1()}
                            </View>
                        </Modal>
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
        backgroundColor: '#40856f',
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
        backgroundColor: '#d2e5df',
        width: wp(97),
        height: wp(10)

    },
    rowOdd: {
        backgroundColor: '#f3faf7',
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
    rowText2: {
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
        color: '#40856f',
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
        borderColor: '#40856f',
        borderWidth: wp(0.3),
        borderRadius: wp(2),
        marginTop: wp(3),
        backgroundColor: '#f3faf7',
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


export default Production