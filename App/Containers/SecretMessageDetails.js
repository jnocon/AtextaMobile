// @flow

import React from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  LayoutAnimation,
  Picker
} from 'react-native'
import { connect } from 'react-redux'
import Styles from './Styles/LoginScreenStyle'
import {Metrics} from '../Themes'
import { Actions as NavigationActions } from 'react-native-router-flux'
import MessageGroupView from './MessageGroupView'

// type GroupDetailsProps = {
//   dispatch: () => any
// }

class SecretMessageDetails extends React.Component {

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
      messageName: this.props.message ? this.props.message.name : null,
      messageText: this.props.message ? this.props.message.text : null,
      alexaResponse: this.props.message ? this.props.message.speech : null,
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
    const { messageName, messageText, alexaResponse } = this.state
    const { fetching } = this.props
    const editable = !fetching
    const textInputStyle = editable ? Styles.textInput : Styles.textInputReadonly
    return (
      <ScrollView contentContainerStyle={{justifyContent: 'center'}} style={[Styles.container, {height: this.state.visibleHeight}]} keyboardShouldPersistTaps='always'>
        <View style={Styles.form}>

          {this.props.message ?
            <View style={Styles.row}>
              <Text style={Styles.rowLabel}>Alexa Command</Text>
              <Picker
                selectedValue={this.state.messageName}
                onValueChange={(value) => this.setState({messageName: value})}>
                <Picker.Item label={this.state.messageName} value={this.state.messageName} />
                <Picker.Item label='How Far Is The Train Station' value='How Far Is The Train Station' />
              </Picker>
            </View>
            : <View style={Styles.row}>
              <Text style={Styles.rowLabel}>Alexa Command</Text>
              <Picker
                selectedValue={this.state.messageName}
                onValueChange={(value) => this.setState({messageName: value})}>
                <Picker.Item label={'Play My Favorite Song'} value='Play My Favorite Song' />
                <Picker.Item label='How Far Is The Train Station' value='How Far Is The Train Station' />
              </Picker>
            </View>
        }

          <View style={Styles.row}>
            <Text style={Styles.rowLabel}>Alexa's' Response</Text>
            <TextInput
              ref='alexaResponse'
              style={textInputStyle}
              value={alexaResponse}
              editable
              keyboardType='default'
              returnKeyType='go'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.handleChangeResponse}
              underlineColorAndroid='transparent'
              onSubmitEditing={this.handleSaveDetails.bind(this)}
              placeholder='Whatever your heart desires' />
          </View>

          <View style={Styles.row}>
            <Text style={Styles.rowLabel}>Message Content</Text>
            <TextInput
              ref='messageText'
              style={textInputStyle}
              value={messageText}
              editable
              keyboardType='default'
              returnKeyType='go'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.handleChangeMessageText}
              underlineColorAndroid='transparent'
              onSubmitEditing={this.handleSaveDetails.bind(this)}
              placeholder='I am in trouble, come over now!' />
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
    message: state.secret.message,
    token: state.login.token,
    messagesArr: state.login.secretMessages,
    userId: state.login.userId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // attemptLogin: (messageName, method) => dispatch(LoginActions.loginRequest(messageName, method))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SecretMessageDetails)
