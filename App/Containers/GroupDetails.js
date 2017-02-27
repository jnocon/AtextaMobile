// @flow

import React from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Picker,
  LayoutAnimation
} from 'react-native'
import { connect } from 'react-redux'
import Styles from './Styles/LoginScreenStyle'
import {Metrics} from '../Themes'
import { Actions as NavigationActions } from 'react-native-router-flux'
import I18n from 'react-native-i18n'
import RecipientsList from './RecipientsList'
import LoginActions from '../Redux/AuthRedux'
import RecipArrActions from '../Redux/RecipArrRedux'
import GroupDetailActions from '../Redux/GroupDetailRedux'
import Immutable from 'seamless-immutable'

// type GroupDetailsProps = {
//   dispatch: () => any
// }

class GroupDetails extends React.Component {

//   props: GroupDetailsProps

//   state: {
//     groupName: string,
//     method: string,
//     recipients: string,
//     visibleHeight: number,
//     topLogo: {
//       width: number
//     }
//   }

  isAttempting: boolean
  keyboardDidShowListener: Object
  keyboardDidHideListener: Object

  // add in (props: GroupDetailsProps) below

  constructor (props) {
    super(props)
    console.log('props in groupDetails = ', this.props)
    this.state = {
      groupName: this.props.group ? this.props.group.name : null,
      mediumType: this.props.group ? this.props.group.mediumType : 'T',
      visibleHeight: Metrics.screenHeight,
      topLogo: { width: Metrics.screenWidth }
    }
    this.isAttempting = false
  }

  componentWillReceiveProps (newProps) {
    this.forceUpdate()
    // Did the login attempt complete?
    if (this.isAttempting && !newProps.fetching) {
      NavigationActions.pop()
    }
  }

  componentWillMount () {
    // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
    // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  keyboardDidShow = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    let newSize = Metrics.screenHeight - e.endCoordinates.height
    this.setState({
      visibleHeight: newSize,
      topLogo: {width: 100, height: 70}
    })
  }

  keyboardDidHide = (e) => {
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({
      visibleHeight: Metrics.screenHeight,
      topLogo: {width: Metrics.screenWidth}
    })
  }

  handleSaveDetails = () => {
    if (this.props.group) {
      if (this.props.group.name) {
        if ((this.state.groupName === this.props.group.name) === false) {
          this.updateGroupNameUtil()
        }
        if (this.props.newRecipArr.length > 0) {
          this.addNewRecipsUtil()
        } else {
          if (this.props.addRecipArr.length > 0) {
            let addArr = []
            let temp = Immutable.asMutable(this.props.addRecipArr, {deep: true})
            temp.forEach(recip => {
              addArr.push(recip.id)
            })
            this.updateGroupRecipsUtil(addArr)
          }
        }
      } else {
        this.createNewGroupUtil()
      }
    // console.log('hi jesse = ', (this.state.messageName === this.props.message.commandName))
    } else {
      this.createNewGroupUtil()
    }
  }

  createNewGroupUtil () {
    console.log('should be here only')
    let groupInfo = {}
    groupInfo.name = this.state.groupName
    groupInfo.userId = this.props.userId
    groupInfo.mediumType = this.state.mediumType
    console.log('group mediumType = ', this.state.mediumType)
    let addArr = []
    let temp = Immutable.asMutable(this.props.addRecipArr, {deep: true})
    temp.forEach(recip => {
      addArr.push(recip.id)
    })
    this.createNewGroup(groupInfo, this.props.newRecipArr, addArr)
    .then(result => result.json())
    .then(result => {
      console.log('hey jesse = ', result)
      result.group.recipients = result.recipients
      result.group.groupId = result.group.id
      let groups = Immutable.asMutable(this.props.groupsArr, {deep: true})
      groups.push(result.group)
      this.props.setGroup(result.group)
      this.props.setAddRecipArr([])
      this.props.setNewRecipArr([])
      this.props.updateGroupArr(groups)
    })
  }

  addNewRecipsUtil () {
    let arrToSend = Immutable.asMutable(this.props.newRecipArr, {deep: true})
    this.addNewRecips(arrToSend)
    .then(res => res.json())
    .then(res => {
      console.log(res)
      let addArr = []
      res.forEach(recip => {
        addArr.push(recip.id)
      })
      if (this.props.addRecipArr.length > 0) {
        let temp = Immutable.asMutable(this.props.addRecipArr, {deep: true})
        temp.forEach(recip => {
          addArr.push(recip.id)
        })
      }
      this.updateGroupRecipsUtil(addArr)
    })
  }

  updateGroupRecipsUtil (addArr) {
    this.updateGroupRecips(this.props.group.groupId, addArr)
    .then(res => {
      this.props.setAddRecipArr([])
    })
  }

  createNewGroup (groupInfo, newRecipArr, newAddArr) {
    console.log('hi jesse groupInfo= ', groupInfo)
    return fetch('http://192.168.1.227:3000/groups/addGroup/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      },
      body: JSON.stringify({
        'groupInfo': groupInfo,
        'newRecipients': newRecipArr,
        'savedRecipients': newAddArr
      })
    })
  }

  handleChangeGroupName = (text) => {
    this.setState({ groupName: text })
  }

  handleChangeMediumType= (value) => {
    this.setState({ mediumType: value })
  }

  handleDelete () {
    this.deleteGroup()
    .then(res => {
      let index
      let groups = Immutable.asMutable(this.props.groupsArr, {deep: true})
      for (var i = 0; i < groups.length; i++) {
        if (groups[i].groupId === this.props.group.groupId) {
          index = i
        }
      }
      groups.splice(index, 1)
      this.props.updateGroupArr(groups)
      NavigationActions.pop()
    })
  }

  deleteGroup () {
    return fetch('http://192.168.1.227:3000/groups/deleteGroup/' + this.props.group.groupId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      }
    })
  }

  updateGroupNameUtil () {
    this.updateGroupName(this.props.group.groupId, this.state.groupName)
    .then(result => result.json())
    .then(result => {
      var groups = Immutable.asMutable(this.props.groupsArr, {deep: true})
      groups.forEach(group => {
        if (group.groupId === this.props.group.groupId) {
          group.name = this.state.groupName
        }
      })
      this.props.updateGroupArr(groups)
    })
    .catch(error => {
      console.log('error in update groupName = ', error)
    })
  }

  updateGroupName (groupId, newName) {
    return fetch('http://192.168.1.227:3000/groups/groupName/', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      },
      body: JSON.stringify({
        'groupId': groupId,
        'groupName': newName
      })
    })
  }

  updateGroupRecips (groupId, addRecipArr) {
    return fetch('http://192.168.1.227:3000/groups/linkRecipient', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      },
      body: JSON.stringify({
        'groupId': groupId,
        'recipients': addRecipArr
      })
    })
  }

  addNewRecips (newRecipArr) {
    return fetch('http://192.168.1.227:3000/groups/newRecipient', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token,
        'userId': this.props.userId,
        'recipients': newRecipArr
      },
      body: JSON.stringify({
        'userId': this.props.userId,
        'recipients': newRecipArr
      })
    })
  }

  render () {
    const { groupName, mediumType } = this.state
    let edit = true
    if (this.props.group) {
      edit = false
    }
    const textInputStyle = Styles.textInput
    return (
      <ScrollView contentContainerStyle={{justifyContent: 'center'}} style={[Styles.container, {height: this.state.visibleHeight}]} keyboardShouldPersistTaps='always'>
        <View style={Styles.form}>
          <View style={Styles.row}>
            <Text style={Styles.rowLabel}>{I18n.t('GroupName')}</Text>
            <TextInput
              ref='groupName'
              style={textInputStyle}
              value={groupName}
              editable
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.handleChangeGroupName}
              underlineColorAndroid='transparent'
              onSubmitEditing={this.handleSaveDetails}
              placeholder='Put Group Name Here' />
          </View>

          {this.props.group
            ? <View style={Styles.row}>
              <Text style={Styles.rowLabel}>{I18n.t('Method')}</Text>
              <Text style={Styles.textInput}>
                {mediumType}
              </Text>
            </View>

            : <View style={Styles.row}>
              <Text style={Styles.rowLabel}>Medium Type</Text>
              <Picker
                selectedValue={this.state.mediumType}
                onValueChange={(value) => this.setState({mediumType: value})}>
                <Picker.Item label='Text Message' value='T' />
                <Picker.Item label='Email' value='E' />
                <Picker.Item label='Slack' value='S' />
              </Picker>
            </View>}

          <View style={Styles.row}>
            <Text style={Styles.rowLabel}>Message Recipients</Text>
            <RecipientsList recipients={this.props.recipientsArr} />
          </View>

          <View style={[Styles.loginRow]}>
            <TouchableOpacity style={Styles.loginButtonWrapper} onPress={this.handleSaveDetails}>
              <View style={Styles.loginButton}>
                <Text style={Styles.loginText}>{I18n.t('SaveGroup')}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={Styles.loginButtonWrapper} onPress={this.handleDelete.bind(this)}>
            <View style={Styles.loginButton}>
              <Text style={Styles.loginText}>Delete Group Forever</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    group: state.group.group,
    recipientsArr: state.group.group ? state.group.group.recipients : [],
    token: state.login.token,
    groupsArr: state.login.groups,
    newRecipArr: state.recipArr.newRecipArr,
    addRecipArr: state.recipArr.addRecipArr,
    removeRecipArr: state.recipArr.removeRecipArr,
    userId: state.login.userId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateGroupArr: (groupArr) => dispatch(LoginActions.updateGroupArr(groupArr)),
    setGroup: (group) => dispatch(GroupDetailActions.setGroup(group)),
    setNewRecipArr: (newRecipArr) => dispatch(RecipArrActions.setNewRecipArr(newRecipArr)),
    setAddRecipArr: (addRecipArr) => dispatch(RecipArrActions.setAddRecipArr(addRecipArr)),
    setRemoveRecipArr: (removeRecipArr) => dispatch(RecipArrActions.setAddRecipArr(removeRecipArr))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetails)
