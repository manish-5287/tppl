import { StyleSheet, Text, View, TouchableOpacity,Modal, Alert } from 'react-native';
import React, { Component } from 'react';
import { Table, Row, Rows } from 'react-native-table-component';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { BASE_URL, makeRequest } from '../../api/Api_info';

export class GRN_Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['GRN No.', 'PO Id', 'Date', 'Bill Date', 'Supplier', 'Amount '],
            rowData: [],
            isPopoverVisible: false,
            popoverContent: ""
        };
    };
    componentDidMount(){
        this.handleGrnOrder();
        };
        
        handleGrnOrder=async()=>{
            try {
                const response=await makeRequest(BASE_URL+'/mobile/dashboard')
                console.log(response);
                const {success,message,grnDetails}=response;
                if (success) {
                    this.setState({rowData:grnDetails});
                    
                } else {
                    Alert.alert(message);
                    
                }
            } catch (error) {
                console.log(error);
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
                        flexArr={[0,0,2,2,3,2]}
                    />
                );
            } else if (Array.isArray(rowData)) {
                let maxLines = 2;
                rowData.forEach(cellData => {
                    const lines = Math.ceil(cellData.length / 20);
                    if (lines > maxLines) {
                        maxLines = lines;
                    }
                });}
    
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
                    flexArr={[0,0,2,2,3,2]}
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

    render() {
        const { tableHead, rowData } = this.state;
        return (
            <View style={styles.container}>
                <Table borderStyle={{ borderWidth: wp(0.2), borderColor: 'white' }}>
                    <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={[0,0,2,2,3,2]}/>
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
                                {this.renderPopoverContent1()}
                            </View>
                        </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: wp(2),   
    },
    head: {
        backgroundColor: '#8D6E63',
        width: wp(95),
        height: wp(12)
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontSize: wp(3),
        fontWeight:'500'
    },
    rowEven: {
        backgroundColor: '#D7CCC8',
        width: wp(95),
        height: wp(12)
    },
    rowOdd: {
        backgroundColor: '#EFEBE9',
        width: wp(95),
        height: wp(12)
    },
    rowText: {
        color: '#212529',
        textAlign: 'left',
        fontSize: wp(2.5),
        paddingHorizontal:wp(0.3),
        marginLeft:4,
        fontWeight:'400'
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
        width:wp(60),
        height:wp(60)
    },
});

export default GRN_Table;
