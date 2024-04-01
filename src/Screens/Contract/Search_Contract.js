import { Text, View, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Table, Row } from 'react-native-table-component';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import CustomLoader from '../../Component/loader/Loader';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';


export default class Search_Contract extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Title', 'Supplier Name', 'Cost', 'Date'],
            rowData: [],
            showProcessingLoader: false,
            isRefreshing: false,
            isLoading: false
        };
    };

    componentDidMount() {
        this.handleContractSearch();
        this._handleListRefresh();

    };
    _handleListRefresh = () => {
        try {
            // pull-to-refresh
            this.setState({ isRefreshing: true }, () => {
                // setTimeout with a delay of 1000 milliseconds (1 second)
                setTimeout(() => {
                    // updating list after the delay
                    this.handleContractSearch();
                    // resetting isRefreshing after the update
                    this.setState({ isRefreshing: false });
                }, 100);
            });
        } catch (error) {
            console.log(error);

        }
    };

    handleContractSearch = async () => {
        try {
            const { contract_id } = this.props.route.params;
            const params = { contract_id };
            // console.log("ContractSearch", contract_id);
            this.setState({ showProcessingLoader: true, isRefreshing: true });
            const response = await makeRequest(BASE_URL + '/mobile/searchcontract', params)
            const { success, message, contractDetails } = response;
            // console.log("ContractSearch", response);
            if (success) {
                // Exclude contract_id from contractDetails
                const modifiedContractDetails = contractDetails.map(({ title, supplier, cost, date }) => ({
                    title, supplier, cost, date
                })); // change by manish

                this.setState({ rowData: modifiedContractDetails, showProcessingLoader: false, isRefreshing: false }); // change by manish

            } else {
                console.log(message);
                this.setState({ showProcessingLoader: false, isRefreshing: false });
            }
        } catch (error) {
            console.log(error);
            this.setState({ showProcessingLoader: false, isRefreshing: false });
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
                    flexArr={[3, 3, 2, 2]}

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

        const rowHeight = maxLines * 20; // Assuming font size of 25

        return (
            <Row
                key={rowIndex}
                data={rowData.map((cellData, columnIndex) => {
                    if (columnIndex === 0) {

                        <TouchableOpacity key={columnIndex} onPress={() => this.handleCellPress(cellData)}>
                            <Text style={[styles.rowText1, { lineHeight: 14, color: 'red' }]}>{cellData}</Text>
                        </TouchableOpacity>

                    } else {
                        <Text key={columnIndex} style={[styles.rowText, { lineHeight: 14 }]}>{cellData}</Text>
                    }
                })}
                textStyle={styles.rowText}
                style={[rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd, { height: rowHeight }]}
                flexArr={[3, 3, 2, 2]}
            />
        );
    };

    handleGoBackHome = () => {
        this.props.navigation.navigate('Contract');
    }
    render() {
        const { tableHead, rowData } = this.state;
        if (this.state.isLoading) {
            return <CustomLoader />;
        }
        const { showProcessingLoader } = this.state;
        return (
            <>

                <View
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        height: wp(14),
                        borderRadius: wp(1),
                        overflow: 'hidden',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row'

                    }}>
                    <TouchableOpacity onPress={this.handleGoBackHome}>
                        <Image source={require('../../Assets/goback/contract.png')}
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
                        }}>Contract</Text>


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
                        <Row data={tableHead} style={styles.head} textStyle={styles.headText} flexArr={[3, 3, 2, 2]} />
                        {rowData.map((rowData, index) => this.renderRowData(rowData, index))}
                    </Table>

                </View>
                {showProcessingLoader && <ProcessingLoader />}
            </>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: wp(2),
        alignSelf: 'center'
    },
    head: {
        backgroundColor: '#212529',
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
        backgroundColor: 'rgba(0,0,0,0.05)',
        width: wp(95),
        height: wp(13)
    },
    rowOdd: {
        backgroundColor: 'white',
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
        textAlign: 'left',
        fontSize: wp(2.5),
        fontWeight: '400',
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