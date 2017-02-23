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
      method: this.props.message ? this.props.message.text : null,
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
    if (this.props.message) {
      if ((this.state.messageName === this.props.message.commandName) === false) {
        this.updateMessageName(this.props.message.id, this.state.messageName)
        .then(result => result.json())
        .then(result => {
          console.log('result after updatating name = ', result)
          var messages = Immutable.asMutable(context.props.messagesArr, {deep: true})
          console.log('before update', messages)
          messages.forEach(message => {
            if (message.id === context.props.message.id) {
            console.log('in update 1', messages,  message.commandName, context.state.messageName)
            this.setState({
                  visibleHeight: Metrics.screenHeight,
                  topLogo: {width: Metrics.screenWidth}
                })
            message.commandName = context.state.messageName
            console.log('in update 2', messages,  message.commandName, context.state.messageName)
            }
          })
          var final = Immutable(messages)
          console.log('after update', final)
          context.props.updateMessageArr(final)
        })
        .catch(error => {
          console.log('error in update messsage = ', error)
        })
      } 
    }
    // console.log('hi jesse = ', (this.state.messageName === this.props.message.commandName))
  }

  handleChangemessageName = (text) => {
    this.setState({ messageName: text })
  }

  handleChangeMethod= (text) => {
    this.setState({ method: text })
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

   updateMessageText (messageId, newText) {
    return fetch('http://192.168.1.227:3000/commands/updateGroup/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.props.token
      },
      body: JSON.stringify({
        'commandId': messageId,
        'newMesssage': newText
      })
    })
  }
  
  updateMessageGroup (messageId, newGroupId) {
    return fetch('http://192.168.1.227:3000/commands/updateGroup/', {
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


  render () {
    const { messageName, method } = this.state
    const { fetching } = this.props
    const editable = !fetching
    const textInputStyle = editable ? Styles.textInput : Styles.textInputReadonly
    return (
      <ScrollView contentContainerStyle={{justifyContent: 'center'}} style={[Styles.container, {height: this.state.visibleHeight}]} keyboardShouldPersistTaps="always">
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
    message: state.message.message,
    token: state.login.token,
    messagesArr: state.login.messages
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateMessageArr: (messageArr) => dispatch(LoginActions.updateMessageArr(messageArr))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageDetails)
