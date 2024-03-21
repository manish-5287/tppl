import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, RefreshControl } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CustomLoader from '../../Component/loader/Loader';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';



export class Stock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Date', 'Opening Stock', 'Received Stock', 'Dispatched Stock', 'Closing Stock'],
            rowData: [],
            currentPage: 0,
            rowsPerPage: 10,
            isPopoverVisible: false,
            showProcessingLoader: false,
            isRefreshing: false,

        };
    }

    // renderRowData = (rowData, rowIndex) => {
    //     let maxLines = 2; // Initialize with minimum one line
    //     rowData.forEach(cellData => {
    //         const lines = Math.ceil(cellData.length / 20); // Assuming 20 characters per line for calculation
    //         if (lines > maxLines) {
    //             maxLines = lines;
    //         }
    //     });

    //     const rowHeight = maxLines * 24; // Assuming font size of 25

    //     return (

    //         <Row
    //             key={rowIndex}
    //             data={rowData.map((cellData, columnIndex) => {
    //                 if (columnIndex === 0) {
    //                     return (
    //                         <TouchableOpacity key={columnIndex} onPress={() => this.handleCellPress(cellData)}>
    //                             <Text style={[styles.rowText1, { lineHeight: 14 }]}>{cellData}</Text>
    //                         </TouchableOpacity>
    //                     );
    //                 } else {
    //                     return <Text key={columnIndex} style={[styles.rowText, { lineHeight: 14 }]}>{cellData}</Text>;
    //                 }
    //             })}
    //             textStyle={styles.rowText}
    //             style={[rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd, { height: rowHeight }]}
    //             flexArr={[0, 2, 2, 2, 2, 2]}
    //         />
    //     );
    // };

    componentDidMount() {
        this.props.navigation.addListener('focus', this._handleListRefresh); // Add listener for screen focus    
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus', this._handleListRefresh); // Remove listener on component unmount
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
                    // this.renderRowData();
                    // resetting isRefreshing after the update
                    this.setState({ isRefreshing: false });
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
                <View style={{
                    backgroundColor: '#EDE7F6',
                    height: wp(14),
                    borderRadius: wp(1),
                    overflow: 'hidden',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <TouchableOpacity onPress={this.handleGoBackHome}>
                        <Image source={require('../../Assets/goback/stock.png')}
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
                        }}>Stock</Text>


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
                                colors={['#9575CD']}
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._handleListRefresh}
                            />
                        }
                    >
                        <View style={styles.search}>
                            <TextInput placeholder='Search Stock' placeholderTextColor='#9575CD' maxLength={25} style={styles.search_text} />
                        </View>

                        <Table style={{ marginTop: wp(3) }} borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
                            <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={[0, 2, 2, 2, 2, 2]} />
                            {/* {slicedData.map((rowData, index) => this.renderRowData(rowData, index))} */}
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
        backgroundColor: '#9575CD',
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
        backgroundColor: '#D1C4E9',
        width: wp(97),
    },
    rowOdd: {
        backgroundColor: '#EDE7F6',
        width: wp(97),
    },
    rowText: {
        color: '#212529',
        textAlign: 'left',
        fontSize: wp(2.6),
        paddingHorizontal: wp(0.3),
        marginLeft: 4,
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
        color: '#9575CD',
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
        borderColor: '#9575CD',
        borderWidth: wp(0.3),
        borderRadius: wp(2),
        marginTop: wp(3),
        backgroundColor: '#EDE7F6',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    search_text: {
        color: '#9575CD',
        fontSize: wp(3.5),
        marginLeft: wp(2),
        fontWeight: "500"
    },
    popoverContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: wp(2),
        borderRadius: 10,
        width: wp(90),
        height: wp(160)

    },

});

export default Stock;
