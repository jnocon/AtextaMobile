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
import LoginActions from '../Redux/AuthRedux'
import Immutable from 'seamless-immutable'

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

  keyboardDidShowListener: Object
  keyboardDidHideListener: Object

  // add in (props: GroupDetailsProps) below

  constructor (props) {
    super(props)
    this.state = {
      messageName: this.props.message ? this.props.message.commandName : null,
      messageText: this.props.message ? this.props.message.text : null,
      messagesArr: this.props.messagesArr,
      visibleHeight: Metrics.screenHeight,
      topLogo: { width: Metrics.screenWidth }
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

  // componentDidMount () {
  //   mapStateToProps
  //   console.log('hi jesse', this.props)
  // }

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
      if (this.props.message.commandName) {
        if ((this.state.messageName === this.props.message.commandName) === false) {
          console.log('this?')
          this.updateMessageName(this.props.message.id, this.state.messageName)
        .then(result => result.json())
        .then(result => {
          var messages = Immutable.asMutable(context.props.messagesArr, {deep: true})
          messages.forEach(message => {
            if (message.id === context.props.message.id) {
              message.commandName = context.state.messageName
            }
          })
          context.props.updateMessageArr(messages)
        })
        .catch(error => {
          console.log('error in update messsageName = ', error)
        })
        }
        if ((this.state.messageText === this.props.message.text) === false) {
          console.log('or here?')
          let newMessage = Immutable.asMutable(this.props.message)
          newMessage.text = this.state.messageText
          this.updateMessageText(this.props.message.id, newMessage)
        .then(result => {
          console.log('after updating message = ', result)
          let res = result
          return res.json()
        })
        .then(result => {
          console.log('after updating message json = ', result)
          var messages = Immutable.asMutable(context.props.messagesArr, {deep: true})
          messages.forEach(message => {
            if (message.id === context.props.message.id) {
              message.text = context.state.messageText
            }
          })
          context.props.updateMessageArr(messages)
        })
        .catch(error => {
          console.log('error in update messsageText = ', error)
        })
        }
      } else {
        console.log(this.props.message)
        let newMessage = {
          text: this.state.messageText,
          additionalContent: null,
          name: this.state.messageName,
          userId: this.props.userId,
          groupId: this.props.message.groupId
        }
        this.creatNewMessage(newMessage)
        .then(result => result.json())
        .then(result => {
          console.log('newMessage =', result)
          var messages = Immutable.asMutable(context.props.messagesArr, {deep: true})
          result.commandName = result.name
          result.mediumType = this.props.message.mediumType
          result.text = this.state.messageText
          messages.push(result)
          this.props.updateMessageArr(messages)
        })
      }
    } else {
      let newMessage = {
        text: this.state.messageText,
        additionalContent: null,
        name: this.state.messageName,
        userId: this.props.userId,
        groupId: null
      }
      this.creatNewMessage(newMessage)
        .then(result => result.json())
        .then(result => {
          console.log('newMessage =', result)
          var messages = Immutable.asMutable(context.props.messagesArr, {deep: true})
          result.commandName = result.name
          result.text = this.state.messageText
          messages.push(result)
          this.props.updateMessageArr(messages)
        })
    }

    // console.log('hi jesse = ', (this.state.messageName === this.props.message.commandName))
  }

  handleChangeMessageName = (text) => {
    this.setState({ messageName: text })
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
      this.props.updateMessageArr(messages)
      NavigationActions.pop()
    })
  }

  deleteMessage () {
    return fetch('http://192.168.1.227:3000/command/deleteCommand/' + this.props.message.id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      }
    })
  }

  creatNewMessage (newMessage) {
    return fetch('http://192.168.1.227:3000/command/newCommand/', {
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
    return fetch('http://192.168.1.227:3000/command/updateName/', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      },
      body: JSON.stringify({
        'commandId': messageId,
        'updateName': newName
      })
    })
  }

  updateMessageText (messageId, newMessage) {
    return fetch('http://192.168.1.227:3000/command/newMessage/', {
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

  render () {
    const { messageName, messageText } = this.state
    const { fetching } = this.props
    const editable = !fetching
    const textInputStyle = editable ? Styles.textInput : Styles.textInputReadonly
    return (
      <ScrollView contentContainerStyle={{justifyContent: 'center'}} style={[Styles.container, {height: this.state.visibleHeight}]} keyboardShouldPersistTaps='always'>
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
              onChangeText={this.handleChangeMessageName}
              underlineColorAndroid='transparent'
              onSubmitEditing={this.handleSaveDetails}
              placeholder='Put Message Name Here' />
          </View>
          <View style={Styles.row}>
            <Text style={Styles.rowLabel}>Message Content</Text>
            <TextInput
              ref='messageText'
              style={textInputStyle}
              value={messageText}
              editable={editable}
              keyboardType='default'
              returnKeyType='go'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.handleChangeMessageText}
              underlineColorAndroid='transparent'
              onSubmitEditing={this.handleSaveDetails}
              placeholder='Running late; Be there when I can!!!' />
          </View>
          {this.props.message
            ? <View style={Styles.row}>
              <Text style={Styles.rowLabel}>Command</Text>
              <Text style={Styles.textInput}>Alexa Open Atexta...</Text>
              <Text style={Styles.textInput}>Alexa Send Quick Message {messageName}</Text>
            </View>
          : <View />}

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
    message: state.message.message,
    token: state.login.token,
    messagesArr: state.login.messages,
    userId: state.login.userId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateMessageArr: (messageArr) => dispatch(LoginActions.updateMessageArr(messageArr))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageDetails)
