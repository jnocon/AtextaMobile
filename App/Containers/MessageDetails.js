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
import MessageGroupView from './MessageGroupView'

// type GroupDetailsProps = {
//   dispatch: () => any
// }

class MessageDetails extends React.Component {

//   props: GroupDetailsProps

//   state: {
//     messageName: string,
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
      messageName: null,
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
    // const { messageName, method } = this.state
    // this.isAttempting = true
    // attempt a login - a saga is listening to pick it up from here.
    // this.props.attemptLogin(messageName, method)
  }

  handleChangemessageName = (text) => {
    this.setState({ messageName: text })
  }

  handleChangeMethod= (text) => {
    this.setState({ method: text })
  }

  render () {
    const { messageName, method } = this.state
    const { fetching } = this.props
    const editable = !fetching
    const textInputStyle = editable ? Styles.textInput : Styles.textInputReadonly
    return (
      <ScrollView contentContainerStyle={{justifyContent: 'center'}} style={[Styles.container, {height: this.state.visibleHeight}]} keyboardShouldPersistTaps>
        <View style={Styles.form}>
          <View style={Styles.row}>
            <Text style={Styles.rowLabel}>Message Name</Text>
            <TextInput
              ref='messageName'
              style={textInputStyle}
              value={messageName}
              editable={editable}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.handleChangemessageName}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.method.focus()}
              placeholder='Put Message Name Here' />
          </View>

          <View style={Styles.row}>
            <Text style={Styles.rowLabel}>Message Content</Text>
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
              placeholder='Running late; Be there when I can!!!' />
          </View>

          <View style={Styles.row}>
            <Text style={Styles.rowLabel}>Command</Text>
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
              placeholder='Alexa Texta Send Retro Reminder' />
          </View>

          <View style={Styles.row}>
            <Text style={Styles.rowLabel}>Message Group</Text>
            <MessageGroupView />
          </View>

          <View style={[Styles.loginRow]}>
            <TouchableOpacity style={Styles.loginButtonWrapper} onPress={this.handleSaveDetails}>
              <View style={Styles.loginButton}>
                <Text style={Styles.loginText}>Save Message</Text>
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
    // attemptLogin: (messageName, method) => dispatch(LoginActions.loginRequest(messageName, method))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageDetails)
