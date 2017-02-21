// @flow

import React from 'react'
import { View, Text, ListView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import RoundedButton from '../Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'
// For empty lists
import AlertMessage from '../Components/AlertMessage'
import RecipDetailActions from '../Redux/RecipDetailRedux'
// Styles
import styles from './Styles/ListviewExampleStyle'

class RecipientsList extends React.Component {
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

    // const dataObjects = [
    //     {name: 'Daniel'},
    //     {name: 'Jesse'},
    //     {name: 'Ricky'},
    //     {name: 'Sean'}
    // ]
    // Datasource is always in state
    this.state = {
      dataSource: ds.cloneWithRows(this.props.recipients)
    }
  }

  /* ***********************************************************
  * `renderRow` function -How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={rowData.title} description={rowData.description} />
  *************************************************************/
  renderRow (recipient) {
    return (
      <TouchableOpacity onPress={() => this.clickRecip(recipient)}>
        <View style={styles.row}>
          <Text style={styles.boldLabel}>{recipient.name}</Text>
        </View>
      </TouchableOpacity>
    )
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

  clickRecip (recipient) {
      console.log("hi jesse= ", recipient)
      this.props.setRecipient(recipient)
      NavigationActions.recipientDetails()
    }
  
  createNewRecip () {
    this.props.setRecipient(undefined)
    NavigationActions.recipientDetails()
  }

  render () {
    return (
      <View style={styles.container}>
        <ListView
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          pageSize={15}
          enableEmptySections
        />
        <RoundedButton onPress={this.createNewRecip.bind(this)}>
           Add New Recipient
        </RoundedButton>
        <RoundedButton onPress={NavigationActions.addressBook}>
           Add From Address Book
        </RoundedButton>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  if (state.group.group) {
    return {
      recipients: state.group.group.recipients
    }
  } else {
    return {
      recipients: []
    }
  }

}

const mapDispatchToProps = (dispatch) => {
  return {
    setRecipient: (recipient) => dispatch(RecipDetailActions.setRecipient(recipient))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecipientsList)
