// @flow

import React from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  LayoutAnimation
} from 'react-native'
import { connect } from 'react-redux'
import Styles from './Styles/LoginScreenStyle'
import {Images, Metrics} from '../Themes'
import RoundedButton from '../Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'
import LoginActions from '../Redux/AuthRedux'
import Immutable from 'seamless-immutable'
import GroupDetailActions from '../Redux/GroupDetailRedux'
import RecipArrActions from '../Redux/RecipArrRedux'
// import I18n from 'react-native-i18n'

// type GroupDetailsProps = {
//   dispatch: () => any
// }

class RecipientDetails extends React.Component {

//   props: GroupDetailsProps

//   state: {
//     recipientName: string,
//     contactInfo: string,
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
    this.state = {
      recipientName: this.props.recipient ? this.props.recipient.name : null,
      contactInfo: this.props.recipient ? this.props.recipient.contactInfo : null,
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
      if (this.props.recipient) {
        let recipInfo = {}
        recipInfo.name = this.state.recipientName
        recipInfo.contactInfo = this.state.contactInfo
        this.updateRecipient(this.props.recipient.id, recipInfo)
      .then(result => {
        var groups = Immutable.asMutable(this.props.groupsArr, {deep: true})
        console.log('groups before = ', groups)
        groups.forEach(group => {
          if (this.props.groupId === group.groupId) {
            group.recipients.forEach(recip => {
              if (recip.id === this.props.recipient.id) {
                recip.name = this.state.recipientName
                recip.contactInfo = this.state.contactInfo
              }
            })
          }
        })
        console.log('groups after = ', groups)
        let group = Immutable.asMutable(this.props.group, {deep: true})
        group.recipients.forEach(recip => {
          if (recip.id === this.props.recipient.id) {
            recip.name = this.state.recipientName
            recip.contactInfo = this.state.contactInfo
          }
        })
        this.props.setGroup(group)
        this.props.updateGroupArr(groups)
      })
      .catch(error => {
        console.log('error in updateRecip =', error)
      })
      } else {
        let recipInfo = {}
        recipInfo.name = this.state.recipientName
        recipInfo.contactInfo = this.state.contactInfo
        recipInfo.mediumType = this.props.group.mediumType
        var groups = Immutable.asMutable(this.props.groupsArr, {deep: true})
        console.log('groups before = ', groups)
        groups.forEach(group => {
          if (this.props.groupId === group.groupId) {
            group.recipients.push({
              name: this.state.recipientName,
              contactInfo: this.state.contactInfo
            })
          }
        })
        console.log('groups after = ', groups)
        let group = Immutable.asMutable(this.props.group, {deep: true})
        group.recipients.push({
          name: this.state.recipientName,
          contactInfo: this.state.contactInfo
        })
        let newRecipArr = Immutable.asMutable(this.props.newRecipArr, {deep: true})
        newRecipArr.push(recipInfo)
        this.props.setNewRecipArr(newRecipArr)
        this.props.setGroup(group)
        this.props.updateGroupArr(groups)
      }
    } else {
      let group = {recipients: []}
      group.recipients.push({
        name: this.state.recipientName,
        contactInfo: this.state.contactInfo
      })
      let recipInfo = {}
      recipInfo.name = this.state.recipientName
      recipInfo.contactInfo = this.state.contactInfo
      recipInfo.mediumType = null
      this.props.setGroup(group)
      let newRecipArr = Immutable.asMutable(this.props.newRecipArr, {deep: true})
      newRecipArr.push(recipInfo)
      this.props.setNewRecipArr(newRecipArr)
    }
  }

  updateRecipient (id, info) {
    return fetch('http://192.168.1.227:3000/groups/recipientInfo', {
      method: 'Put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      },
      body: JSON.stringify({
        recipientId: id,
        recipientInfo: info
      })
    })
  }

  newRecipient (id, info) {
    return fetch('http://192.168.1.227:3000/groups/newRecipient', {
      method: 'Post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      },
      body: JSON.stringify({
        userId: id,
        recipientInfo: info
      })
    })
  }

  removeRecip () {
    return fetch('http://192.168.1.227:3000/groups/groupRecipient/' + this.props.group.groupId + '/' + this.props.recipient.id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      }
    })
  }

  handleRemove () {
    this.removeRecip()
    .then(res => {
      let index
      let group = Immutable.asMutable(this.props.group, {deep: true})
      for (var i = 0; i < group.recipients.length; i++) {
        if (group.recipients[i].id === this.props.recipient.id) {
          index = i
        }
      }
      group.recipients.splice(index, 1)
      this.props.setGroup(group)
      var groups = Immutable.asMutable(this.props.groupsArr, {deep: true})
      let groupJ
      let recipG
      for (var j = 0; j < groups.length; j++) {
        for (var g = 0; g < groups[j].recipients.length; g++) {
          if (groups[j].recipients[g].id === this.props.recipient.id) {
            groupJ = j
            recipG = g
          }
        }
      }
      groups[groupJ].recipients.splice(recipG, 1)
      this.props.updateGroupArr(groups)
      NavigationActions.pop()
    })
  }

  handleDelete () {
    this.deleteRecip()
    .then(res => {
      let index
      let group = Immutable.asMutable(this.props.group, {deep: true})
      for (var i = 0; i < group.recipients.length; i++) {
        if (group.recipients[i].id === this.props.recipient.id) {
          index = i
        }
      }
      group.recipients.splice(index, 1)
      this.props.setGroup(group)
      NavigationActions.pop()
    })
  }

  deleteRecip () {
    return fetch('http://192.168.1.227:3000/groups/recipient/' + this.props.recipient.id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      }
    })
  }

  handleChangeRecipientName = (text) => {
    this.setState({ recipientName: text })
  }

  handleChangeContactInfo= (text) => {
    this.setState({ contactInfo: text })
  }

  render () {
    const { recipientName, contactInfo } = this.state
    const editable = true
    const textInputStyle = Styles.textInput
    return (
      <ScrollView contentContainerStyle={{justifyContent: 'center'}} style={[Styles.container, {height: this.state.visibleHeight}]} keyboardShouldPersistTaps='always'>
        <Image source={Images.logo} style={[Styles.topLogo, this.state.topLogo]} />
        <View style={Styles.form}>
          <View style={Styles.row}>
            <Text style={Styles.rowLabel}>Recipient Name</Text>
            <TextInput
              ref='recipientName'
              style={textInputStyle}
              value={recipientName}
              editable={editable}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.handleChangeRecipientName}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.contactInfo.focus()}
              placeholder='Put Recipient Name Here' />
          </View>

          <View style={Styles.row}>
            <Text style={Styles.rowLabel}>Contact Info</Text>
            <TextInput
              ref='contactInfo'
              style={textInputStyle}
              value={contactInfo}
              editable={editable}
              keyboardType='default'
              returnKeyType='go'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.handleChangeContactInfo}
              underlineColorAndroid='transparent'
              onSubmitEditing={this.handleSaveDetails}
              placeholder='phone number, email, etc' />
          </View>

          <RoundedButton >
           Import From Phone Contacts (NF)
        </RoundedButton>

          <View style={[Styles.loginRow]}>
            <TouchableOpacity style={Styles.loginButtonWrapper} onPress={this.handleSaveDetails}>
              <View style={Styles.loginButton}>
                <Text style={Styles.loginText}>Save Recipient</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={Styles.loginButtonWrapper} onPress={this.handleRemove.bind(this)}>
              <View style={Styles.loginButton}>
                <Text style={Styles.loginText}>Remove Recipient From Group</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={Styles.loginButtonWrapper} onPress={this.handleDelete.bind(this)}>
            <View style={Styles.loginButton}>
              <Text style={Styles.loginText}>Delete Recipient Forever!</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    recipient: state.recipient.recipient,
    group: state.group.group,
    token: state.login.token,
    groupsArr: state.login.groups,
    groupId: state.group.group ? state.group.group.groupId : null,
    userId: state.login.userId,
    newRecipArr: state.recipArr.newRecipArr,
    removeArr: state.recipArr.removeRecipArr
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateGroupArr: (groupArr) => dispatch(LoginActions.updateGroupArr(groupArr)),
    setGroup: (group) => dispatch(GroupDetailActions.setGroup(group)),
    setNewRecipArr: (newRecipArr) => dispatch(RecipArrActions.setNewRecipArr(newRecipArr)),
    setRemoveRecipArr: (removeRecipArr) => dispatch(RecipArrActions.setRemoveRecipArr(removeRecipArr))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecipientDetails)
