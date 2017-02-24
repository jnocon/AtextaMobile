// @flow

import React from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  LayoutAnimation
} from 'react-native'
import { connect } from 'react-redux'
import Styles from './Styles/LoginScreenStyle'
import {Metrics} from '../Themes'
import { Actions as NavigationActions } from 'react-native-router-flux'
import I18n from 'react-native-i18n'
import RecipientsList from './RecipientsList'
import LoginActions from '../Redux/AuthRedux'
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
      method: this.props.group ? this.props.group.mediumType : null,
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
    let context = this
    if (this.props.group) {
      console.log('hi jesse', this.props.group, this.state.groupName)
      if ((this.state.groupName === this.props.group.name) === false) {
        this.updateGroupName(this.props.group.groupId, this.state.groupName)
        .then(result => result.json())
        .then(result => {
          var groups = Immutable.asMutable(context.props.groupsArr, {deep: true})
          groups.forEach(group => {
            if (group.groupId === context.props.group.groupId) {
              group.name = context.state.groupName
            }
          })
          context.props.updateGroupArr(groups)
        })
        .catch(error => {
          console.log('error in update groupName = ', error)
        })
      }
    }
    // console.log('hi jesse = ', (this.state.messageName === this.props.message.commandName))
  }

  handleChangeGroupName = (text) => {
    this.setState({ groupName: text })
  }

  handleChangeMethod= (text) => {
    this.setState({ method: text })
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

  render () {
    const { groupName, method } = this.state
    let editable = false
    if (this.state.method) {
      editable = false
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

          <View style={Styles.row}>
            <Text style={Styles.rowLabel}>{I18n.t('Method')}</Text>
            <TextInput
              ref='method'
              style={textInputStyle}
              value={method}
              editable={editable}
              keyboardType='default'
              returnKeyType='go'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.handleChangeMethod}
              underlineColorAndroid='transparent'
              onSubmitEditing={this.handleSaveDetails}
              placeholder='Text, Slack, Email' />
          </View>

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
    groupsArr: state.login.groups
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateGroupArr: (groupArr) => dispatch(LoginActions.updateGroupArr(groupArr))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetails)
