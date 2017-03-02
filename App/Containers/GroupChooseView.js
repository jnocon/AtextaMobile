import React from 'react'
import { View, Text, ListView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import RoundedButton from '../Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'
import GroupDetailActions from '../Redux/GroupDetailRedux'
import MessageDetailActions from '../Redux/MessageDetailRedux'
import LoginActions from '../Redux/AuthRedux'
import Immutable from 'seamless-immutable'

// Styles
import styles from './Styles/ListviewGridExampleStyle'

class GroupChooseView extends React.Component {

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
    // const dataObjects = [
    //   {title: 'All Students', description: 'Slack'},
    //   {title: "HIR's", description: 'Email'},
    //   {title: 'Ricky and Serge', description: 'Text'}
    // ]

    /* ***********************************************************
    * STEP 2
    * Teach datasource how to detect if rows are different
    * Make this function fast!  Perhaps something like:
    *   (r1, r2) => r1.id !== r2.id}
    *************************************************************/
    const rowHasChanged = (r1, r2) => r1 !== r2

    // DataSource configured
    const ds = new ListView.DataSource({rowHasChanged})

    // Datasource is always in state
    this.state = {
      dataSource: ds.cloneWithRows(this.props.groups)
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
  renderRow (rowData) {
    return (
      <TouchableOpacity onPress={() => this.clickGroup(rowData)} style={styles.row}>
        <Text style={styles.boldLabel}>{rowData.name}</Text>
        <Text style={styles.label}>{rowData.mediumType}</Text>
      </TouchableOpacity>
    )
  }

  /* ***********************************************************
  * STEP 4
  * If your datasource is driven by Redux, you'll need to
  * reset it when new data arrives.
  * DO NOT! place `cloneWithRows` inside of render, since render
  * is called very often, and should remain fast!  Just replace
  * state's datasource on newProps.
  *
  * e.g.
    componentWillReceiveProps (newProps) {
      if (newProps.someData) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(newProps.someData)
        })
      }
    }
  *************************************************************/

  // Used for friendly AlertMessage
  // returns true if the dataSource is empty
  noRowData () {
    return this.state.dataSource.getRowCount() === 0
  }

  clickGroup (group) {
    if (this.props.message) {
      let newMessage = Immutable.asMutable(this.props.message, {deep: true})
      this.updateMessageGroup(newMessage.id, group.groupId)
      .then(result => result.json())
      .then(result => {
        console.log("hi jesse= ", group, newMessage)
        newMessage.groupId = group.groupId
        newMessage.groupName = group.name
        newMessage.mediumType = group.mediumType
        console.log('whats good dude =', newMessage)
        this.props.setMessage(newMessage)
        let messages = Immutable.asMutable(this.props.messagesArr, {deep: true})
        messages.forEach(message => {
        if (message.id === newMessage.id) {
            message.groupId = group.groupId
            message.groupName = group.name
            message.mediumType = group.mediumType
            }
          })
        this.props.updateMessageArr(messages)
        NavigationActions.pop()
      })
      .catch(error => {
        console.log('error in choose new group for message = ', error)
      }) 
    } else {
      let messageGroup = {
        groupId: group.groupId,
        groupName: group.name,
        mediumType: group.mediumType
      }
      this.props.setMessage(messageGroup)
      NavigationActions.pop()
    }
      
      
    }

  updateMessageGroup (messageId, newGroupId) {
    return fetch('http://192.168.1.227:3000/command/updateGroup/', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      },
      body: JSON.stringify({
        'commandId': messageId,
        'groupId': newGroupId
      })
    })
  }
  
  createNewGroup () {
    this.props.setGroup(undefined)
    NavigationActions.groupDetails()
  }

  render () {
    return (
      <View style={styles.container}>
        <ListView
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          pageSize={15}
        />
        <RoundedButton onPress={this.createNewGroup.bind(this)}>
           Create New Group
        </RoundedButton>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    groups: state.login.groups,
    message: state.message.message,
    messagesArr: state.login.messages,
    token: state.login.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setGroup: (group) => dispatch(GroupDetailActions.setGroup(group)),
    setMessage: (message) => dispatch(MessageDetailActions.setMessage(message)),
    updateMessageArr: (messageArr) => dispatch(LoginActions.updateMessageArr(messageArr))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupChooseView)
