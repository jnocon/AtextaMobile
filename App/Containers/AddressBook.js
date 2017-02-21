// @flow

import React from 'react'
import { View, Text, ListView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
// For empty lists
import AlertMessage from '../Components/AlertMessage'
// Styles
import styles from './Styles/ListviewExampleStyle'

class AddressBook extends React.Component {
  state: {
    dataSource: Object
  }

  constructor (props) {
    super(props)
    /* ***********************************************************
    * Teach datasource how to detect if rows are different
    * Make this function fast!  Perhaps something like:
    *   (r1, r2) => r1.id !== r2.id}
    *************************************************************/
    const rowHasChanged = (r1, r2) => r1 !== r2

    // DataSource configured
    const ds = new ListView.DataSource({rowHasChanged})

    const dataObjects = [
        {name: 'Daniel'},
        {name: 'Jesse'},
        {name: 'Ricky'},
        {name: 'Sean'}
    ]
    // Datasource is always in state
    this.state = {
      dataSource: ds.cloneWithRows(dataObjects)
    }
  }

  /* ***********************************************************
  * `renderRow` function -How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={rowData.title} description={rowData.description} />
  *************************************************************/
  renderRow (rowData) {
    return (
      <TouchableOpacity onPress={NavigationActions.pop}>
        <View style={styles.row}>
          <Text style={styles.boldLabel}>{rowData.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  componentDidMount () {
      this.getAddressBook(this.props.token, this.props.userId, this.props.groupId, this.props.type)
      .then(result => {
        console.log('AddressBook = ', result)
        var res = result
        return res.json()
      })
      .then(result => {
        console.log('AddressBook = ', result)
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(result)
        })
      })
      .catch(error => {
        console.log("error in addressBookGet = ", error)
      })
    }

    getAddressBook(token, userId, groupId, type) {
      console.log("hi ricky = ", token, userId, groupId, type)
      return fetch('http://192.168.1.227:3000/groups/availableRecipients/' + userId + '/' + groupId + '/' + type, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
    }

  /* ***********************************************************
  * If your datasource is driven by Redux, you'll need to
  * reset it when new data arrives.
  * DO NOT! place `cloneWithRows` inside of render, since render
  * is called very often, and should remain fast!  Just replace
  * state's datasource on newProps.
  *
  * e.g.
  *************************************************************/
//   componentWillReceiveProps (newProps) {
//     if (newProps.results) {
//       this.setState({
//         dataSource: this.state.dataSource.cloneWithRows(newProps.results)
//       })
//     }
//   }

  // Used for friendly AlertMessage
  // returns true if the dataSource is empty
  noRowData () {
    return this.state.dataSource.getRowCount() === 0
  }

  render () {
    return (
      <View style={styles.container}>
        <ListView
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          pageSize={15}
          enableEmptySections
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  let groupNumber = 0;
  let groupType = 0;
  if (state.group.group === undefined) {
    groupType = 'T'
  } else {
    groupNumber = state.group.group.groupId
    groupType = state.group.group.mediumType
  }
  return {
    token: state.login.token,
    groupId: groupNumber,
    type: groupType,
    userId: state.login.userId
  }
}

export default connect(mapStateToProps)(AddressBook)
