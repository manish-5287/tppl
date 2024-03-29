import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert, Linking } from 'react-native';
import React, { Component } from 'react';
import { Table, Row, Rows } from 'react-native-table-component';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { BASE_URL, makeRequest } from '../../api/Api_info';

export class Reverses_Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Id', 'Contract name', 'Product', 'Received By', 'Date'],
            rowData: [],
            reverseId: ''
        };
    }
    componentDidMount() {
        this.handleReverse();
    };

    handleReverse = async () => {
        try {
            const response = await makeRequest(BASE_URL + '/mobile/dashboard')
            // console.log("reverse_table",response);
            const { success, message, reverseDetails } = response;
            if (success) {
                this.setState({ rowData: reverseDetails });

            } else {
                console.log(message);

            }
        } catch (error) {
            console.log(error);
        }
    }

    handlePress = (cellData) => {
        this.setState({ reverseId: cellData }, () => {
            this._handleReversePdf();
        })
    };

    _handleReversePdf = async () => {
        try {
            const { reverseId } = this.state;
            const params = { reverse_id: reverseId };
            const response = await makeRequest(BASE_URL + '/mobile/reversepdf', params);
            const { success, message, pdfLink } = response;
            if (success) {
                this.setState({ cellData: pdfLink });
                Linking.openURL(pdfLink);

            } else {
                console.log('====================================');
                console.log(message);
                console.log('====================================');
            }
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
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
                                        <TouchableOpacity key={cellIndex} onPress={() => this.handlePress(cellData)}>
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
        alignSelf: 'center',
        marginTop: wp(2)
    },
    head: {
        backgroundColor: '#197486',
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
        backgroundColor: '#d4eef4',
        width: wp(95),
        height: wp(12)
    },
    rowOdd: {
        backgroundColor: '#f4fdfe',
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
export default Reverses_Table