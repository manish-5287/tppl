import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert } from 'react-native'
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
                this.setState({ rowData: productionDetails });

            } else {
                console.log(message);

            }
        } catch (error) {
            console.log(error);
        }
    }

    handleIdPress = (id) => {
        // Handle onPress for Id here
        console.log('Pressed Id:', id);
        // You can add your logic for handling the Id press, such as navigating to another screen
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
                                        <TouchableOpacity key={cellIndex} onPress={() => this.handleIdPress(cellData)}>
                                            <Text style={styles.Highlight}>{cellData}</Text>
                                        </TouchableOpacity>
                                    );
                                } else if ((cellIndex === 2)) {
                                    return (
                                        <TouchableOpacity key={cellIndex} onPress={() => this.handleIdPress(cellData)}>
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
