import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Modal, Alert, FlatList } from 'react-native'
import React, { Component } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Table, Row } from 'react-native-table-component';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import CustomLoader from '../../Component/loader/Loader';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';

export class Supllier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Date', 'Description', 'Credit', 'Debit', 'Balance'],
            rowData: [],
            currentPage: 0,
            rowsPerPage: 10,
            isPopoverVisible: false,
            popoverContent: "",
            showProcessingLoader: false,
            searchName: '',
            contractName: []
        };
    }

    componentDidMount() {
        this.handleSUpplier();
    };

    handleSUpplier = async () => {
        try {
            this.setState({ showProcessingLoader: true })
            const response = await makeRequest(BASE_URL + '/mobile/vendor')
            console.log(response);
            const { success, message, vendorDetails } = response;
            if (success) {
                this.setState({ rowData: vendorDetails, showProcessingLoader: false });
                Alert.alert(message);
            } else {
                Alert.alert(message);

            }
        } catch (error) {
            console.log(error);
        }
    }

    renderRowData = (rowData, rowIndex) => {
        if (typeof rowData === 'object' && rowData !== null) {
            return (
                <Row
                    key={rowIndex}
                    data={Object.values(rowData)}
                    textStyle={styles.rowText}
                    style={[rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd]}
                    flexArr={[2, 3, 2, 2, 2]}
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
                    if (columnIndex === 1) {
                        return (
                            <TouchableOpacity key={columnIndex} onPress={() => this.handleCellPress(cellData)}>
                                <Text style={[styles.rowText1, { lineHeight: 15 }]}>{cellData}</Text>
                            </TouchableOpacity>
                        );
                    } else if (columnIndex === 2) {
                        return (
                            <TouchableOpacity key={columnIndex} onPress={() => this.handleCellPress1(cellData)}>
                                <Text style={[styles.rowText1, { lineHeight: 15 }]}>{cellData}</Text>
                            </TouchableOpacity>
                        );
                    }
                    else {
                        return <Text key={columnIndex} style={[styles.rowText, { lineHeight: 11 }]}>{cellData}</Text>;
                    }
                })}
                textStyle={styles.rowText}
                style={[rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd, { height: rowHeight }]}
                flexArr={[2, 3, 2, 2, 2]}
            />
        );
    };

    handleVendorReport = () => {
        this.props.navigation.navigate('report')
    }

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
            const params = { vendorname: searchName };
            console.log('eeeeeee', params);
            const response = await makeRequest(BASE_URL + '/mobile/searchvendorname', params);
            const { success, message, vendorName } = response;
            // console.log(response);
            if (success) {
                this.setState({ contractName: vendorName });
            } else {
                Alert.alert(message);
            }
        } catch (error) {
            console.log(error);
        }
    };


    handleProductPress = (item) => {
        const { contract_id } = item;
        // Navigate to the ProductDetailScreen with the selected item
        this.props.navigation.navigate('Search_Reverse', { contract_id });

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
                        backgroundColor: '#E0F7FA',
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
                        }}>Supplier</Text>

                </View>


                <View style={styles.container}>
                    <ScrollView style={{ marginBottom: wp(16) }} showsVerticalScrollIndicator={false}>
                        <View style={styles.search}>
                            <TextInput
                                placeholder='Search vendor name'
                                placeholderTextColor='#00838F'
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
                                        <Text style={styles.noResultsText}>No Result Found</Text>
                                    </View>
                                )}
                            </View>
                        ) : null}

                        {/* Vendor button */}

                        <TouchableOpacity onPress={this.handleVendorReport}>
                            <View style={{ width: wp(35), height: wp(10), borderRadius: wp(3.5), backgroundColor: '#00838F', justifyContent: 'center', alignItems: 'center', marginTop: wp(2), alignSelf: 'flex-end' }}>
                                <Text style={{ fontSize: wp(3.7), fontWeight: '500', color: 'white' }}>Vendor Report</Text>
                            </View>
                        </TouchableOpacity>


                        {/* Table  */}

                        <Table style={{ marginTop: wp(3) }} borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
                            <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={[2, 3, 2, 2, 2]} />
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

});

export default Supllier