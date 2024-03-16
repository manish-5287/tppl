import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Modal, Alert, TouchableWithoutFeedback, Keyboard, RefreshControl } from 'react-native'
import React, { Component } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Table, Row } from 'react-native-table-component';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import CustomLoader from '../../Component/loader/Loader';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';


export class PO extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Id', 'Date', 'Vendor', 'Qty', 'Amount', 'Delivery'],
            rowData: [],
            currentPage: 0,
            rowsPerPage: 15,
            isPopoverVisible: false,
            popoverContent: "",
            searchPO: '',
            showProcessingLoader: false,
            isRefreshing: false
        };
    };

    componentDidMount() {
        this.handlePO();
    };

    handlePO = async () => {
        try {
            this.setState({ showProcessingLoader: true })
            const response = await makeRequest(BASE_URL + '/mobile/purchaseorder')
            const { success, message, poDetails } = response;
            // console.log("po",response); 
            if (success) {
                this.setState({ rowData: poDetails, showProcessingLoader: false });
            } else {
                console.log(message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    handlePOSearch = async (searchPO) => {
        try {
            if (searchPO.length < 1) {
                this.setState({ searchPO, rowData: [] });
                return;
            }
            const params = { po_id: searchPO };
            // console.log('Search', params);
            const response = await makeRequest(BASE_URL + '/mobile/searchpurchaseorder', params)
            const { success, message, purchaseDetails } = response;
            // console.log('2222222', response);
            if (success) {
                this.setState({ rowData: purchaseDetails })
            } else {
                console.log(message);
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
                    flexArr={[0, 2, 3, 2, 2, 2]}
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
                    } else {
                        return <Text key={columnIndex} style={[styles.rowText, { lineHeight: 15 }]}>{cellData}</Text>;
                    }
                })}
                textStyle={styles.rowText}
                style={[rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd, { height: rowHeight }]}
                flexArr={[0, 2, 3, 2, 2, 2]}
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

    _handleListRefreshing = async () => {
        try {
            // pull-to-refresh
            this.setState({ isRefreshing: true }, () => {
                // setTimeout with a delay of 1000 milliseconds (1 second)
                setTimeout(() => {
                    // updating list after the delay
                    this.handlePO();
                    // resetting isRefreshing after the update
                    this.setState({ isRefreshing: false , searchPO: ''});
                }, 100);
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
        const { showProcessingLoader } = this.state

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

                <View style={styles.container}>
                    <ScrollView
                        style={{ marginBottom: wp(16) }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._handleListRefreshing}
                                colors={['#039BE5']}
                            />
                        }
                    >

                        <View style={styles.search}>
                            <TextInput
                                placeholder='Search Purchase order ID'
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



                        <Table style={{ marginTop: wp(3) }} borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
                            <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={[0, 2, 3, 2, 2, 2]} />
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

});

export default PO