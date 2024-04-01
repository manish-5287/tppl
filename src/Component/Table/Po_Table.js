import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert, Linking } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { BASE_URL, makeRequest } from '../../api/Api_info';

export default class Po_Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Id', 'Date', 'Vendor', 'Quantity', 'Amount', 'Delivery'],
            rowData: [],
            purchaseorderId: '',
            poPrimary: '',
            isRevised: ''

        };
    };
    componentDidMount() {
        this.handlePurchaseOrder();
    };

    handlePurchaseOrder = async () => {
        try {
            const response = await makeRequest(BASE_URL + '/mobile/dashboard')
            // console.log('po_table',response);
            const { success, message, poDetails } = response;
            if (success) {
                const modifiedPurchaseDetails = poDetails.map(({ poid, date, supplier, qty, amount, delivery }) => ({
                    poid, date, supplier, qty, amount, delivery
                })) // change by manish
                this.setState({ rowData: modifiedPurchaseDetails }); // changes  by mansih 
            } else {
                console.log(message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    handlePurchase = (cellData) => {
        this.setState(
            {
                purchaseorderId: cellData,
                poPrimary: cellData1,
                isRevised: cellData2,
            },
            () => {
                this.handlePurchaseId(cellData);
            }
        );
    };

    handlePurchaseId = async (purchaseorderId, poPrimary, isRevised) => {
        try {
            const params = {
                purchaseorder_id: purchaseorderId,
                po_primary: poPrimary,
                is_revised: isRevised
            };
            console.log('papapapapapap', params);
            const response = await makeRequest(BASE_URL + '/mobile/purchaseorderpdf', params);
            const { success, message, pdfLink } = response;
            console.log('pdfpdfpdf', response);
            if (success) {
                this.setState({ cellData: pdfLink });
                Linking.openURL(pdfLink);
            } else {
                console.log('====================================');
                console.log(message);
                console.log('====================================');
            }
        } catch (error) {
            console.log(error);
        }
    };



    render() {
        const { tableHead, rowData } = this.state;
        return (
            <View style={styles.container}>
                <Table borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
                    <Row data={tableHead} style={styles.head} textStyle={styles.headText} flexArr={[0, 2, 3, 2, 2, 2]} />
                    {rowData.map((rowData, index) => (
                        <Row
                            key={index}
                            data={Object.values(rowData).map((cellData, cellIndex) => {
                                if (cellIndex === 0) {
                                    return (
                                        <TouchableOpacity key={cellIndex} onPress={() => this.handlePurchase(cellData, rowData.poPrimary, rowData.isRevised)}>
                                            <Text style={styles.Highlight}>{cellData}</Text>
                                        </TouchableOpacity>
                                    );
                                }
                                else {
                                    return <Text style={styles.rowText}>{cellData}</Text>;
                                }
                            })}
                            textStyle={styles.rowText}
                            style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                            flexArr={[0, 2, 3, 2, 2, 2]}
                        />
                    ))}
                </Table>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: wp(2),
    },
    head: {
        backgroundColor: "#039BE5",
        width: wp(95),
        height: wp(12)
    },
    headText: {
        color: 'white',
        textAlign: 'center',
        fontSize: wp(3),
        fontWeight: '500'
    },
    rowEven: {
        backgroundColor: '#81D4FA',
        width: wp(95),
        height: wp(13)
    },
    rowOdd: {
        backgroundColor: '#B3E5FC',
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
    Highlight: {
        color: 'red',
        textAlign: 'left',
        fontSize: wp(2.5),
        fontWeight: '500',
        paddingHorizontal: wp(0.3),
        marginLeft: 4,

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