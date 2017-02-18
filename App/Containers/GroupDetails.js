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
    this.state = {
      groupName: null,
      method: null,
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
    // const { groupName, method } = this.state
    // this.isAttempting = true
    // attempt a login - a saga is listening to pick it up from here.
    // this.props.attemptLogin(groupName, method)
  }

  handleChangeGroupName = (text) => {
    this.setState({ groupName: text })
  }

  handleChangeMethod= (text) => {
    this.setState({ method: text })
  }

  render () {
    const { groupName, method } = this.state
    const { fetching } = this.props
    const editable = !fetching
    const textInputStyle = editable ? Styles.textInput : Styles.textInputReadonly
    return (
      <ScrollView contentContainerStyle={{justifyContent: 'center'}} style={[Styles.container, {height: this.state.visibleHeight}]} keyboardShouldPersistTaps>
        <View style={Styles.form}>
          <View style={Styles.row}>
            <Text style={Styles.rowLabel}>{I18n.t('GroupName')}</Text>
            <TextInput
              ref='groupName'
              style={textInputStyle}
              value={groupName}
              editable={editable}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.handleChangegroupName}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.method.focus()}
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
              onChangeText={this.handleChangemethod}
              underlineColorAndroid='transparent'
              onSubmitEditing={this.handleSaveDetails}
              placeholder='Text, Slack, Email' />
          </View>

          <View style={Styles.row}>
            <Text style={Styles.rowLabel}>Message Recipients</Text>
            <RecipientsList />
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
    // fetching: state.login.fetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // attemptLogin: (groupName, method) => dispatch(LoginActions.loginRequest(groupName, method))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetails)
