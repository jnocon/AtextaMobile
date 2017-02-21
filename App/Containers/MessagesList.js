// @flow

import React from 'react'
import { View, ListView, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import RoundedButton from '../Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'
import MessageDetailActions from '../Redux/MessageDetailRedux'

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
    // const dataObjects = {
    //   Text: [
    //     {commandName: 'First commandName', groupName: 'First Group Name', text: 'First text'},
    //     {commandName: 'First commandName', groupName: 'Second Group Name', text: 'Second text'},
    //     {commandName: 'First commandName', groupName: 'Third Group Name', text: 'Third text'},
    //     {commandName: 'First commandName', groupName: 'Fourth Group Name', text: 'Fourth text'}
    //   ],
    //   Email: [
    //    {commandName: 'First commandName', groupName: 'First Group Name', text: 'First text'},
    //     {commandName: 'First commandName', groupName: 'Second Group Name', text: 'Second text'},
    //     {commandName: 'First commandName', groupName: 'Third Group Name', text: 'Third text'},
    //     {commandName: 'First commandName', groupName: 'Fourth Group Name', text: 'Fourth text'}
    //   ],
    //   Slack: [
    //     {commandName: 'First commandName', groupName: 'First Group Name', text: 'First text'},
    //     {commandName: 'First commandName', groupName: 'Second Group Name', text: 'Second text'},
    //     {commandName: 'First commandName', groupName: 'Third Group Name', text: 'Third text'},
    //     {commandName: 'First commandName', groupName: 'Fourth Group Name', text: 'Fourth text'},
    //     {commandName: 'BLACKJACK!', groupName: 'BLACKJACK! Group Name', text: 'BLACKJACK! Description'}
    //   ]
    // }

    
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
      dataSource: ds.cloneWithRowsAndSections({Text: this.props.messages})
    }
  }

  // componentDidMount = () => {
  //   console.log('CDM messagesList')
  //     this.getMessages(this.props.userId)
  //     .then(result => {
  //       console.log('messageslist = ', result)
  //       var res = result
  //       return res.json()
  //     })
  //     .then(result => {
  //       console.log('messages list = ', result)
  //       var data = {
  //         Text: result
  //       }
  //       this.setState({
  //         dataSource: this.state.dataSource.cloneWithRowsAndSections(data)
  //       })
  //     })
  //     .catch(error => {
  //       console.log("error in messagesListGet = ", error)
  //     })
  //   }

    getMessages(userId) {
      return fetch('http://192.168.1.227:3000/command/userCommands/' + userId, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      
      })
    }

  renderRow (rowData, sectionID) {
    // You can condition on sectionID (key as string), for different cells
    // in different sections
    return (
      <TouchableOpacity onPress = {() => this.clickMessage(rowData)}>
        <View style={styles.row}>
          <Text style={styles.boldLabel}>{sectionID} - {rowData.commandName}</Text>
          <Text style={styles.label}>{rowData.text}</Text>
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
    
  *************************************************************/
componentWillReceiveProps (newProps) {
  console.log("is messages props changing?", newProps)
      if (newProps.messages) {
        let data = {Texts: newProps.messages}
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(data)
        })
      }
    }
  // Used for friendly AlertMessage
  // returns true if the dataSource is empty
  noRowData () {
    return this.state.dataSource.getRowCount() === 0
  }

  clickMessage (message) {
      console.log("hi jesse= ", message)
      this.props.setMessage(message)
      NavigationActions.messageDetails()
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

  createNewMessage () {
    this.props.setMessage(undefined)
    NavigationActions.messageDetails()
  }

  

  render () {
    return (
      <View style={styles.container}>
        <ListView
          renderSectionHeader={this.renderHeader}
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections
        />
        <RoundedButton onPress={this.createNewMessage.bind(this)}>
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
  //logic to seperate out messages here
  return {
    messages: state.login.messages
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
   setMessage: (message) => dispatch(MessageDetailActions.setMessage(message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesList)
