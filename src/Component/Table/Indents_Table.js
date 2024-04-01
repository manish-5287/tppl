import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert, Linking } from 'react-native';
import React, { Component } from 'react';
import { Table, Row, Rows } from 'react-native-table-component';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { BASE_URL, makeRequest } from '../../api/Api_info';

export class Indents_Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Id', 'Contract name', 'Product', 'Issue By', 'Date'],
            rowData: [],
            indentId: '',
            contractId: ''

        };
    }


    componentDidMount() {
        this.handleIndentOrder(); // changes by manish
    };



    // changes by manish 

    handlePressIndentId = (cellData) => {
        this.setState({ indentId: cellData }, () => {
            this.handleIndentPdf();
        });

    };

    handleIndentPdf = async () => {
        try {
            const { indentId } = this.state;
            const params = { indent_id: indentId };
            const response = await makeRequest(BASE_URL + '/mobile/indentpdf', params);
            const { success, message, pdfLink } = response
            if (success) {
                this.setState({ cellData: pdfLink });
                Linking.openURL(pdfLink);

            } else {
                console.log(message)
            }
        } catch (error) {

        }
    }

    // pdf api by manish
    handlePressContract = (cellData) => {
        this.setState({ contractId: cellData }, () => {
            this._handleContractPdf();
        });
    }
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

    handleIndentOrder = async () => { // changes by manish 
        try {
            const response = await makeRequest(BASE_URL + '/mobile/dashboard')
            // console.log('Indent_Table',response);
            const { success, message, indentDetails } = response;
            if (success) {

                const modificationGrnDetails = indentDetails.map(({ indent_id, contact_name, product, issued_name, date }) => ({
                    indent_id, contact_name, product, issued_name, date
                })) // changes by manish
                this.setState({ rowData: modificationGrnDetails });  // chnages by manish 

            } else {
                console.log(message);

            }
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        const { tableHead, rowData } = this.state;
        return (
            <View style={styles.container}>
                <Table borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
                    <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={[0, 3, 3, 2, 2]} />
                    {rowData.map((rowData, index) => (
                        <Row
                            key={index}
                            data={Object.values(rowData).map((cellData, cellIndex) => {
                                if (cellIndex === 0) {
                                    return (
                                        <TouchableOpacity key={cellIndex} onPress={() => this.handlePressIndentId(cellData)}>
                                            <Text style={styles.Highlight}>{cellData}</Text>
                                        </TouchableOpacity>
                                    );
                                } else if (cellIndex === 1) {
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
                            flexArr={[0, 3, 3, 2, 2]}
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
        backgroundColor: '#757575',
        width: wp(95),
        height: wp(12)
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontSize: wp(3),
        fontWeight: '500'
    },
    rowEven: {
        backgroundColor: '#E0E0E0',
        width: wp(95),
        height: wp(12)
    },
    rowOdd: {
        backgroundColor: '#EEEEEE',
        width: wp(95),
        height: wp(12)
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
export default Indents_Table