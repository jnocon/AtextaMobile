// @flow

import React from 'react'
import { View, ListView, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import RoundedButton from '../Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'

// For empty lists
import AlertMessage from '../Components/AlertMessage'

// Styles
import styles from './Styles/ListviewExampleStyle'

class MessagesList extends React.Component {

  state: {
    dataSource: Object
  }

  constructor (props) {
    super(props)

    /* ***********************************************************
    * STEP 1
    * This is an array of objects with the properties you desire
    * Usually this should come from Redux mapStateToProps
    *************************************************************/
    const dataObjects = {
      Text: [
        {title: 'First Title', groupName: 'First Group Name', description: 'First Description'},
        {title: 'First Title', groupName: 'Second Group Name', description: 'Second Description'},
        {title: 'First Title', groupName: 'Third Group Name', description: 'Third Description'},
        {title: 'First Title', groupName: 'Fourth Group Name', description: 'Fourth Description'}
      ],
      Email: [
       {title: 'First Title', groupName: 'First Group Name', description: 'First Description'},
        {title: 'First Title', groupName: 'Second Group Name', description: 'Second Description'},
        {title: 'First Title', groupName: 'Third Group Name', description: 'Third Description'},
        {title: 'First Title', groupName: 'Fourth Group Name', description: 'Fourth Description'}
      ],
      Slack: [
        {title: 'First Title', groupName: 'First Group Name', description: 'First Description'},
        {title: 'First Title', groupName: 'Second Group Name', description: 'Second Description'},
        {title: 'First Title', groupName: 'Third Group Name', description: 'Third Description'},
        {title: 'First Title', groupName: 'Fourth Group Name', description: 'Fourth Description'},
        {title: 'BLACKJACK!', groupName: 'BLACKJACK! Group Name', description: 'BLACKJACK! Description'}
      ]
    }
    /* ***********************************************************
    * STEP 2
    * Teach datasource how to detect if rows are different
    * Make this function fast!  Perhaps something like:
    *   (r1, r2) => r1.id !== r2.id}
    *   The same goes for sectionHeaderHasChanged
    *************************************************************/
    const rowHasChanged = (r1, r2) => r1 !== r2
    const sectionHeaderHasChanged = (s1, s2) => s1 !== s2

    // DataSource configured
    const ds = new ListView.DataSource({rowHasChanged, sectionHeaderHasChanged})

    // Datasource is always in state
    this.state = {
      dataSource: ds.cloneWithRowsAndSections(dataObjects)
    }
  }

  /* ***********************************************************
  * STEP 3
  * `renderRow` function -How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={rowData.title} description={rowData.description} />
  *************************************************************/
  renderRow (rowData, sectionID) {
    // You can condition on sectionID (key as string), for different cells
    // in different sections
    return (
      <TouchableOpacity onPress={NavigationActions.messageDetails}>
        <View style={styles.row}>
          <Text style={styles.boldLabel}>{sectionID} - {rowData.title}</Text>
          <Text style={styles.label}>{rowData.groupName}</Text>
          <Text style={styles.label}>{rowData.description}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  /* ***********************************************************
  * STEP 4
  * If your datasource is driven by Redux, you'll need to
  * reset it when new data arrives.
  * DO NOT! place `cloneWithRowsAndSections` inside of render, since render
  * is called very often, and should remain fast!  Just replace
  * state's datasource on newProps.
  *
  * e.g.
    componentWillReceiveProps (newProps) {
      if (newProps.someData) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(newProps.someData)
        })
      }
    }
  *************************************************************/

  // Used for friendly AlertMessage
  // returns true if the dataSource is empty
  noRowData () {
    return this.state.dataSource.getRowCount() === 0
  }

  renderHeader (data, sectionID) {
    switch (sectionID) {
      case 'Text':
        return <Text style={styles.boldLabel}>Texts</Text>
      case 'Email':
        return <Text style={styles.boldLabel}>Emails</Text>
      case 'Slack':
        return <Text style={styles.boldLabel}>Slack</Text>
      default:
        return <Text style={styles.boldLabel}>Miscellaneous</Text>
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <AlertMessage title='Nothing to See Here, Move Along' show={this.noRowData()} />
        <ListView
          renderSectionHeader={this.renderHeader}
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          enableEmptySections
        />
        <RoundedButton onPress={NavigationActions.messageDetails}>
            Create New Message
        </RoundedButton>
        <RoundedButton onPress={NavigationActions.secretMessageDetails}>
            Create Secret Message
        </RoundedButton>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesList)
