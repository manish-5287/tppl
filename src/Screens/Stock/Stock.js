import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Modal } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CustomLoader from '../../Component/loader/Loader';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';

export class Stock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['S No.', 'Date', 'Opening Stock', 'Received Stock', 'Dispatched Stock', 'Closing Stock'],
            rowData: [
                ['S No.', 'Date', 'Opening Stock', 'Received Stock', 'Dispatched Stock', 'Closing Stock'],
                ['S No.', 'Date', 'Opening Stock', 'Received Stock', 'Dispatched Stock', 'Closing Stock'],
                ['S No.', 'Date', 'Opening Stock', 'Received Stock', 'Dispatched Stock', 'Closing Stock'],
                ['S No.', 'Date', 'Opening Stock', 'Received Stock', 'Dispatched Stock', 'Closing Stock'],

            ],
            currentPage: 0,
            rowsPerPage: 10,
            isPopoverVisible: false,
            popoverContent: "",
            showProcessingLoader: false
        };
    }

    renderRowData = (rowData, rowIndex) => {
        let maxLines = 2; // Initialize with minimum one line
        rowData.forEach(cellData => {
            const lines = Math.ceil(cellData.length / 20); // Assuming 20 characters per line for calculation
            if (lines > maxLines) {
                maxLines = lines;
            }
        });

        const rowHeight = maxLines * 24; // Assuming font size of 25

        return (

            <Row
                key={rowIndex}
                data={rowData.map((cellData, columnIndex) => {
                    if (columnIndex === 0) {
                        return (
                            <TouchableOpacity key={columnIndex} onPress={() => this.handleCellPress(cellData)}>
                                <Text style={[styles.rowText1, { lineHeight: 14 }]}>{cellData}</Text>
                            </TouchableOpacity>
                        );
                    } else {
                        return <Text key={columnIndex} style={[styles.rowText, { lineHeight: 14 }]}>{cellData}</Text>;
                    }
                })}
                textStyle={styles.rowText}
                style={[rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd, { height: rowHeight }]}
                flexArr={[0, 1, 2, 2, 2, 2]}
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
                <View style={{
                    backgroundColor: '#EDE7F6',
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
                    <Text style={{
                        color: '#333',
                        fontSize: wp(5),
                        fontWeight: '500',
                        marginRight: wp(40),
                        letterSpacing: wp(0.4)
                    }}>Stocks</Text>
                </View>
                
                <View style={styles.container}>
                    <ScrollView style={{ marginBottom: wp(16) }} showsVerticalScrollIndicator={false}>
                        <View style={styles.search}>
                            <TextInput placeholder='Search vendor name' placeholderTextColor='#9575CD' maxLength={25} style={styles.search_text} />
                        </View>

                        <Table style={{ marginTop: wp(3) }} borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
                            <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={[0, 1, 2, 2, 2, 2]} />
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

export default Stock;
