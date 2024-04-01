import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert, Linking } from 'react-native'
import React, { Component } from 'react'
import { Table, Row } from 'react-native-table-component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BASE_URL, makeRequest } from '../../api/Api_info';


export default class Production_Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Id', 'Date', 'Contract Name', '	Product', 'Plan Qty', 'Prep Qty'],
            rowData: [],
            contractId: '',
            productionId: ''

        }
    };
    componentDidMount() {
        this.handleProductionOrder();
    };

    handleProductionOrder = async () => {
        try {
            const response = await makeRequest(BASE_URL + '/mobile/dashboard')
            // console.log("production_table",response);
            const { success, message, productionDetails } = response;
            if (success) {
                const modifiedProductionDetails = productionDetails.map(({ po_id, date, contact_name, product, plannedqty, preparedqty }) => ({
                    po_id, date, contact_name, product, plannedqty, preparedqty
                })) // changes by manish
                this.setState({ rowData: modifiedProductionDetails }); // chnages by manish

            } else {
                console.log(message);

            }
        } catch (error) {
            console.log(error);
        }
    }

    // pdf api by manish

    handlePressProductID = (cellData) => {
        this.setState({ productionId: cellData }, () => {
            this._handlePressProductpdf();
        });
    }

    _handlePressProductpdf = async () => {
        try {
            const { productionId } = this.state;
            const params = { production_id: productionId };
            console.log('papapapapapap', params);
            const response = await makeRequest(BASE_URL + '/mobile/productionorderpdf', params);
            const { success, message, pdfLink } = response;
            console.log('pdfpdfpdf', response);
            if (success) {
                this.setState({ cellData: pdfLink });
                Linking.openURL(pdfLink)
            } else {
                console.log('====================================');
                console.log(message);
                console.log('====================================');
            }
        } catch (error) {
            console.log(error);
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



    render() {
        const { tableHead, rowData } = this.state;
        return (
            <View style={styles.container}>
                <Table borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
                    <Row data={tableHead} style={styles.head} textStyle={styles.headText} flexArr={[0, 2, 3, 3, 1, 1]} />
                    {rowData.map((rowData, index) => (
                        <Row
                            key={index}
                            data={Object.values(rowData).map((cellData, cellIndex) => {
                                if (cellIndex === 0) {
                                    return (
                                        <TouchableOpacity key={cellIndex} onPress={() => this.handlePressProductID(cellData)} >
                                            <Text style={styles.Highlight}>{cellData}</Text>
                                        </TouchableOpacity>
                                    );
                                } else if ((cellIndex === 2)) {
                                    return (
                                        <TouchableOpacity key={cellIndex} onPress={() => this.handlePressContract(cellData)}>
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
                            flexArr={[0, 2, 3, 3, 1, 1]}
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
