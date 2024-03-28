import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Modal, Alert, Keyboard, TouchableWithoutFeedback, ScrollViewBase, RefreshControl, Linking } from 'react-native'
import React, { Component } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Table, Row } from 'react-native-table-component';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';
import CustomLoader from '../../Component/loader/Loader';




export default class GRN extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Id', 'Po Id', 'Date', 'Bill Date', 'Supplier', 'Amount '],
            rowData: [],
            currentPage: 0,
            rowsPerPage: 9,
            searchGRN: '',
            showProcessingLoader: false,
            isRefreshing: false,
            isLoading: false,
            goodsID: '',
            cellData: ''

        };
    }

    componentDidMount() {
        this.handleGRN();
        this.props.navigation.addListener('focus', this._handleListRefreshing); // Add listener for screen focus
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus', this._handleListRefreshing); // Remove listener on component unmount
    }

    handlePress = (cellData) => {
        this.setState({ goodsID: cellData }, () => {
            this._handleGRNPdf();
        });
    }
    _handleGRNPdf = async () => {
        try {
            const { goodsID } = this.state;
            const params = { goods_id: goodsID };
            console.log('papapapapapap', params);
            const response = await makeRequest(BASE_URL + '/mobile/grnpopup', params);
            const { success, message, pdfLink } = response;
            console.log('pdfpdfpdf', response);
            if (success) {
                this.setState({ cellData: pdfLink });
                Linking.openURL(pdfLink)
            } else {
                Alert.alert(message)
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleGRN = async () => {
        try {

            this.setState({ isRefreshing: true })
            const response = await makeRequest(BASE_URL + '/mobile/grn')
            const { success, message, grnDetails } = response;
            // console.log("grn",response);
            if (success) {
                this.setState({ rowData: grnDetails, isRefreshing: false });

            } else {
                console.log(message);
                this.setState({ isRefreshing: false });


            }
        } catch (error) {
            console.log(error);
            this.setState({ isRefreshing: false });

        }
    };
    handlesearchGrn = async (searchGRN) => {
        try {
            if (!searchGRN.trim()) {
                this.setState({ rowData: [], currentPage: 0 });
                this.handleGRN();
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
                const params = { po_id: searchGRN };
                const response = await makeRequest(BASE_URL + '/mobile/searchgrn', params);
                const { success, message, grnreceiveDetails } = response;

                if (success) {
                    this.setState({ rowData: grnreceiveDetails, currentPage: 0 });
                } else {
                    console.log(message); // Log the error message for debugging
                    // Optionally, you can show an alert or toast message to inform the user about the error
                }
            }
        } catch (error) {
            console.log(error); // Log any network or other errors for debugging
            // Optionally, you can show an alert or toast message to inform the user about the error
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



    _handleListRefreshing = async () => {
        try {
            // pull-to-refresh
            this.setState({ isRefreshing: true }, () => {
                // setTimeout with a delay of 1000 milliseconds (1 second)
                setTimeout(() => {
                    // updating list after the delay
                    this.handleGRN();
                    // resetting isRefreshing after the update
                    this.setState({ isRefreshing: false, searchGRN: '', currentPage: 0 });
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
                        backgroundColor: '#EFEBE9',
                        height: wp(14),
                        borderRadius: wp(1),
                        overflow: 'hidden',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row'

                    }}>
                    <TouchableOpacity onPress={this.handleGoBackHome}>
                        <Image source={require('../../Assets/goback/grn.png')}
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
                        }}>GRN</Text>


                    <Image source={require('../../Assets/applogo.png')}
                        style={{
                            width: wp(16),
                            height: wp(13),
                            resizeMode: 'contain',
                            marginRight: wp(2)
                        }} />

                </View>

                <View style={styles.search}>
                    <TextInput
                        placeholder='Search Grn Id'
                        placeholderTextColor='#8D6E63'
                        maxLength={25}
                        keyboardType='number-pad'
                        value={this.state.searchGRN}
                        onChangeText={(searchGRN) => {
                            this.setState({ searchGRN });
                            this.handlesearchGrn(searchGRN);
                        }}

                        style={styles.search_text} />
                </View>

                <View style={styles.container}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._handleListRefreshing}
                                colors={['#8D6E63']}
                            />
                        }>

                        <Table style={{ marginTop: wp(2) }} borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
                            <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={[0, 0, 2, 2, 3, 2]} />
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
                                                <TouchableOpacity key={cellIndex}>
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
                                    flexArr={[0, 0, 2, 2, 3, 2]}
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
        backgroundColor: '#8D6E63',
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
        backgroundColor: '#D7CCC8',
        width: wp(97),
        height: wp(10)
    },
    rowOdd: {
        backgroundColor: '#EFEBE9',
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
        marginTop: wp(6),
        paddingHorizontal: wp(3)
    },
    paginationText: {
        fontSize: wp(3.5),
        color: '#8D6E63',
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
        borderColor: '#8D6E63',
        borderWidth: wp(0.3),
        borderRadius: wp(2),
        marginTop: wp(3),
        backgroundColor: '#EFEBE9',
        justifyContent: 'center',
        alignSelf: 'center'

    },
    search_text: {
        color: '#8D6E63',
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

