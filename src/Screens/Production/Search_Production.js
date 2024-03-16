import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert, Image } from 'react-native'
import React, { Component } from 'react'
import { Table, Row } from 'react-native-table-component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BASE_URL, makeRequest } from '../../api/Api_info';


export default class Search_Production extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Id', 'Date', 'Contract Name', 'Product', 'Plan Qty', 'Prep Qty'],
            rowData: [],
            isPopoverVisible: false,
            popoverContent: ""
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

        const rowHeight = maxLines * 19; // Assuming font size of 25
        return (
            <Row
                key={rowIndex}
                data={rowData.map((cellData, columnIndex) => {
                    if (columnIndex === 1) { // Check if it's the first column (PO Id)
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

    closePopover = () => {
        // Close the popover
        this.setState({
            isPopoverVisible: false,
            popoverContent: ""
        });
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

    componentDidMount() {
        this.handleContractSearch();
    };

    handleContractSearch = async () => {
        try {
            const { contract_id } = this.props.route.params;
            const params = { contract_id };
            // console.log("handleContractSearch", contract_id);
            const response = await makeRequest(BASE_URL + '/mobile/searchproduction', params)
            const { success, message, searchProduction } = response;
            // console.log("handleContractSearch_response", response);
            if (success) {
                this.setState({ rowData: searchProduction });

            } else {
                console.log(message);
            }
        } catch (error) {
            console.log(error);
        }
    }
    handleGoBackHome = () => {
        this.props.navigation.navigate('Production');
    }

    render() {
        const { tableHead, rowData } = this.state;
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
                    <Table borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
                        <Row data={tableHead} style={styles.head} textStyle={styles.headText} flexArr={[0, 2, 3, 3, 1, 1]} />
                        {rowData.map((rowData, index) => this.renderRowData(rowData, index))}
                    </Table>

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
                </View>
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
        width: wp(95),
        height: wp(12)
    },
    headText: {
        color: 'white',
        textAlign: 'center',
        fontSize: wp(3),
        fontWeight: '500',

    },
    rowEven: {
        backgroundColor: '#d2e5df',
        width: wp(95),
        height: wp(13)
    },
    rowOdd: {
        backgroundColor: '#f3faf7',
        width: wp(95),
        height: wp(13)
    },
    rowText: {
        color: '#212529',
        textAlign: 'left',
        fontSize: wp(2.5),
        paddingHorizontal: wp(0.3),
        marginLeft: 4,
        fontWeight: '400'
    },
    rowText1: {
        color: 'red',
        textAlign: 'center',
        fontSize: wp(2.8),

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
