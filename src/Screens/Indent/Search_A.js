import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert, Image } from 'react-native';
import React, { Component } from 'react';
import { Table, Row } from 'react-native-table-component';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { BASE_URL, makeRequest } from '../../api/Api_info';
import ProcessingLoader from '../../Component/loader/ProcessingLoader';

export class Search_A extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Id', 'Contract name', 'Product', 'Issue By', 'Date'],
            rowData: [],
            isPopoverVisible: false,
            popoverContent: "",
            showProcessingLoader: false,
            isRefreshing: false,
            isLoading: false
        };
    }

    renderRowData = (rowData, rowIndex) => {
        if (typeof rowData === 'object' && rowData !== null) {
            return (
                <Row
                    key={rowIndex}
                    data={Object.values(rowData)}
                    textStyle={styles.rowText}
                    style={[rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd]}
                    flexArr={[0, 2, 3, 3, 2, 2]}
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
                    if (columnIndex === 0) {
                        return (
                            <TouchableOpacity key={columnIndex} onPress={() => this.handleCellPress(cellData)}>
                                <Text style={[styles.rowText1, { lineHeight: 14 }]}>{cellData}</Text>
                            </TouchableOpacity>
                        );
                    } else if (columnIndex === 1) {
                        return (
                            <TouchableOpacity key={columnIndex} onPress={() => this.handleCellPress1(cellData)}>
                                <Text style={[styles.rowText1, { lineHeight: 14 }]}>{cellData}</Text>
                            </TouchableOpacity>
                        );
                    } else {
                        return <Text key={columnIndex} style={[styles.rowText, { lineHeight: 14 }]}>{cellData}</Text>;
                    }
                })}
                textStyle={styles.rowText}
                style={[rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd, { height: rowHeight }]}
                flexArr={[0, 2, 3, 3, 2, 2]}
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

    handleCellPress1 = (cellData) => {
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

    renderPopoverContent1 = () => {
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
        this.handleIndentSearch();
        this._handleListRefresh();

    };
    _handleListRefresh = () => {
        try {
            // pull-to-refresh
            this.setState({ isRefreshing: true }, () => {
                // setTimeout with a delay of 1000 milliseconds (1 second)
                setTimeout(() => {
                    // updating list after the delay
                    this.handleIndentSearch();
                    // resetting isRefreshing after the update
                    this.setState({ isRefreshing: false });
                }, 100);
            });
        } catch (error) {
            console.log(error);

        }
    };

    handleIndentSearch = async () => {
        try {
            const { contract_id } = this.props.route.params;
            const params = { contract_id };
            // console.log("IndentSearch", contract_id);
            this.setState({ showProcessingLoader: true, isRefreshing: true })

            const response = await makeRequest(BASE_URL + '/mobile/searchindent', params)
            // console.log("IndentSearch", response);
            const { success, message, searchIndent } = response;
            if (success) {
                this.setState({ rowData: searchIndent,showProcessingLoader: false, isRefreshing: false });

            } else {
                console.log(message);
            this.setState({ showProcessingLoader: false, isRefreshing: false });

            }
        } catch (error) {
            console.log(error);
            this.setState({ showProcessingLoader: false, isRefreshing: false });

        }
    }

    handleGoBackHome = () => {
        this.props.navigation.navigate('Indent_A');
    }

    render() {
        const { tableHead, rowData } = this.state;
        if (this.state.isLoading) {
            return <CustomLoader />;
        }
        const { showProcessingLoader } = this.state
        return (
            <>

                <View
                    style={{
                        backgroundColor: '#EEEEEE',
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
                        }}>Indent</Text>


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
                        <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={[0, 2, 3, 3, 2, 2]} />
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
    rowText1: {
        color: 'red',
        textAlign: 'center',
        fontSize: wp(2.5),
        // Optional: add underline to indicate touchability
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

export default Search_A;
