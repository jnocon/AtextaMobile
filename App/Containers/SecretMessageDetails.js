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
import SecretGroupView from './SecretGroupView'
import LoginActions from '../Redux/AuthRedux.js'
import SecretDetailActions from '../Redux/SecretDetailRedux'
import Immutable from 'seamless-immutable'

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
      newName: undefined,
      firstChoice: this.props.messageChoices[0],
      messageText: this.props.message ? this.props.message.text : null,
      alexaResponse: this.props.message ? this.props.message.speech : null,
      messageChoices: this.props.messageChoices ? this.props.messageChoices : [],
      visibleHeight: Metrics.screenHeight,
      topLogo: { width: Metrics.screenWidth }
    }
    this.isAttempting = false
  }

  // componentWillReceiveProps (newProps) {

  // }

  componentWillMount () {
    if (this.props.messageChoices.length === 0) {
      this.updateGroupChoices()
      .then(res => res.json())
      .then(res => {
        console.log('message choices = ', res)
        this.props.setChoices(res)
        this.setState({
          messageChoices: res,
          firstChoice: res[0]
        })
      })
    }
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  updateGroupChoices () {
    return fetch('http://192.168.1.227:3000/secretCommand/availableSecretTriggers/' + this.props.userId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      }
    })
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
    console.log(this.props.message)
    if (this.props.message) {
      if (this.props.message.name) {
        if (this.state.newName) {
          console.log('this?')
          this.updateMessageName(this.props.message.id, this.state.newName.id)
        .then(result => result)
        .then(result => {
          var messages = Immutable.asMutable(context.props.messagesArr, {deep: true})
          messages.forEach(message => {
            if (message.id === context.props.message.id) {
              message.name = context.state.newName.name
            }
          })
          context.props.updateSecretArr(messages)
        })
        .catch(error => {
          console.log('error in update messsageName = ', error)
        })
        }
        if (this.state.messageText !== this.props.message.text) {
          console.log('or here?')
          let newMessage = Immutable.asMutable(this.props.message)
          newMessage.text = this.state.messageText
          this.updateMessageText(this.props.message.id, newMessage)
          .then(result => {
            console.log('after updating message = ', result)
            let res = result
            return res
          })
          .then(result => {
            console.log('after updating message json = ', result)
            var messages = Immutable.asMutable(context.props.messagesArr, {deep: true})
            messages.forEach(message => {
            if (message.id === context.props.message.id) {
              message.text = context.state.messageText
            }
          })
            context.props.updateSecretArr(messages)
          })
          .catch(error => {
            console.log('error in update messsageText = ', error)
          })
        }
        if (this.state.alexaResponse !== this.props.message.speech) {
          console.log('or here?')
          let newMessage = Immutable.asMutable(this.props.message)
          newMessage.speech = this.state.alexaResponse
          this.updateAlexaResponse(this.props.message.id, newMessage)
          .then(result => {
            console.log('after updating message = ', result)
            let res = result
            return res
          })
          .then(result => {
            console.log('after updating message json = ', result)
            var messages = Immutable.asMutable(context.props.messagesArr, {deep: true})
            messages.forEach(message => {
            if (message.id === context.props.message.id) {
              message.speech = this.state.alexaResponse
            }
          })
            context.props.updateSecretArr(messages)
          })
          .catch(error => {
            console.log('error in update messsageText = ', error)
          })
        }
      } else {
        console.log(this.state.newName)
        let newMessage = {
          text: this.state.messageText,
          additionalContent: null,
          triggerId: this.state.newName ? this.state.newName.id : this.state.firstChoice.id,
          responseSpeech: this.state.alexaResponse,
          userId: this.props.userId,
          groupId: this.props.message.groupId
        }
        this.createNewMessage(newMessage)
        .then(result => result.json())
        .then(result => {
          console.log('newMessage =', result)
          var messages = Immutable.asMutable(context.props.messagesArr, {deep: true})
          result.name = result.name
          result.mediumType = this.props.message.mediumType
          result.text = this.state.messageText
          messages.push(result)
          context.props.updateSecretArr(messages)
        })
      }
    } else {
      console.log(this.props.message)
        let newMessage = {
          text: this.state.messageText,
          additionalContent: 'Hi Ricky',
          triggerId: this.state.newName ? this.state.newName.name : this.state.firstChoice.name,
          responseSpeech: this.state.alexaResponse,
          userId: this.props.userId,
          groupId: null
        }
        this.createNewMessage(newMessage)
        .then(result => result.json())
        .then(result => {
          console.log('newMessage =', result)
          var messages = Immutable.asMutable(context.props.messagesArr, {deep: true})
          result.name = this.state.newName ? this.state.newName.name : this.state.firstChoice.id,
          result.text = this.state.messageText
          messages.push(result)
          context.props.updateSecretArr(messages)
        })
    }

    // console.log('hi jesse = ', (this.state.messageName === this.props.message.commandName))
  }

  handleChangeAlexaResponse= (text) => {
    this.setState({ alexaResponse: text })
  }

  handleChangeMessageText= (text) => {
    this.setState({ messageText: text })
  }

  handleDelete () {
    this.deleteMessage()
    .then(res => {
      let index
      let messages = Immutable.asMutable(this.props.messagesArr, {deep: true})
      for (var i = 0; i < messages.length; i++) {
        if (messages[i].id === this.props.message.id) {
          index = i
        }
      }
      messages.splice(index, 1)
      this.props.updateSecretArr(messages)
      NavigationActions.pop()
    })
  }

  deleteMessage () {
    return fetch('http://192.168.1.227:3000/secretCommand/deleteCommand/' + this.props.message.id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      }
    })
  }

  createNewMessage (newMessage) {
     console.log('in create new message = ', newMessage)
    return fetch('http://192.168.1.227:3000/secretCommand/newCommand/', {
      method: 'Post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      },
      body: JSON.stringify({newCommand: newMessage})
    })
  }

  updateMessageName (messageId, newName) {
    console.log('in update message name = ', messageId, newName)
    return fetch('http://192.168.1.227:3000/secretCommand/updateTrigger', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      },
      body: JSON.stringify({
        'commandId': messageId,
        'newTriggerId': newName
      })
    })
  }

  updateAlexaResponse (messageId, newResponse) {
    console.log('in update ar = ', messageId, newResponse)
    return fetch('http://192.168.1.227:3000/secretCommand/secretResponse', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      },
      body: JSON.stringify({
        'commandId': messageId,
        'newResponse': newResponse
      })
    })
  }

  updateMessageText (messageId, newMessage) {
    console.log('in update message text = ', messageId, newMessage)
    return fetch('http://192.168.1.227:3000/secretCommand/newMessage/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      },
      body: JSON.stringify({
        'commandId': messageId,
        'newMessage': newMessage
      })
    })
  }

  pickerList () {
    return this.state.messageChoices.map(choice => {
      return (
        <Picker.Item label={choice.name} value={choice} key={choice.id} />
      )
    })
  }

  render () {
    const { messageName, messageText, alexaResponse } = this.state
    const { fetching } = this.props
    const editable = !fetching
    const textInputStyle = editable ? Styles.textInput : Styles.textInputReadonly
    return (
      <ScrollView contentContainerStyle={{justifyContent: 'center'}} style={[Styles.container, {height: this.state.visibleHeight}]} keyboardShouldPersistTaps='always'>
        <View style={Styles.form}>

          {this.state.messageName
            ? <View style={Styles.row}>
              <Text style={Styles.rowLabel}>Alexa Command</Text>
              <Picker
                selectedValue={messageName}
                onValueChange={(value) => this.setState({newName: value})}>
                <Picker.Item label={messageName} value={messageName} />
                {this.pickerList()}
              </Picker>
            </View>
            : <View style={Styles.row}>
              <Text style={Styles.rowLabel}>Alexa Command</Text>
              <Picker
                selectedValue={this.state.messageChoices[0]}
                onValueChange={(value) => this.setState({newName: value})}>
                {this.pickerList()}
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
              onChangeText={this.handleChangeAlexaResponse}
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
            <SecretGroupView />
          </View>

          <View style={[Styles.loginRow]}>
            <TouchableOpacity style={Styles.loginButtonWrapper} onPress={this.handleSaveDetails}>
              <View style={Styles.loginButton}>
                <Text style={Styles.loginText}>Save Message</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={Styles.loginButtonWrapper} onPress={this.handleDelete.bind(this)}>
              <View style={Styles.loginButton}>
                <Text style={Styles.loginText}>Delete Message</Text>
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
    userId: state.login.userId,
    messageChoices: state.secret.messageChoices
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecretArr: (secretArr) => dispatch(LoginActions.updateSecretArr(secretArr)),
    setChoices: (messageChoices) => dispatch(SecretDetailActions.setChoices(messageChoices))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SecretMessageDetails)
