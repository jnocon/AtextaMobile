 import React, { Component } from 'react'

 import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity
} from 'react-native'

 import { connect } from 'react-redux'
 import LoginActions from '../Redux/AuthRedux'

 import Auth0Lock from 'react-native-lock'
 import styles from './Styles/PresentationScreenStyle'
 import { Images } from '../Themes'
 import credentials from './Config/AuthOCredentials.js'

 class WelcomeView extends Component {

   _onLogin = () => {
     var context = this
     let lock = new Auth0Lock(credentials)
     console.log('here?', lock)
     lock.show({
       closable: true
     }, (err, profile, token) => {
       if (err) {
         console.log(err)
         return
       }
       context.getUserId(token.accessToken)
    .then(result => result.json())
    .then(result => {
      console.log('result from auth is', result.userSecrets)
      console.log(this.props)
      this.props.setUserData(result.userId, result.userCommands, result.userGroups, result.userSecrets, result.token, true)
    })
    .catch(error => {
      console.log('error in user result = ', error)
    })
     })
   }

   getUserId = (token) => {
     return fetch('http://192.168.1.227:3000/auth/login', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({'token': token})
     })
   }

   render () {
     return (

       <View style={styling.container}>
         <View style={styles.centered}>
           <Image source={Images.atextaLogo} style={styles.logo} />
         </View>
         <View style={styling.messageBox}>
           <Text style={styling.title}>Welcome To Atexta</Text>
           <Text style={styling.subtitle}>Login With Your Amazon Account to Continue</Text>
         </View>
         <TouchableOpacity
           style={styling.signInButton}
           underlayColor='#949494'
           onPress={this._onLogin}>
           <Text>Log In</Text>
         </TouchableOpacity>
       </View>
     )
   };

}

 var styling = StyleSheet.create({
   container: {
     flex: 1,
     flexDirection: 'column',
     justifyContent: 'center',
     backgroundColor: '#270943'
   },
   messageBox: {
     flex: 1,
     justifyContent: 'center'
   },
   badge: {
     alignSelf: 'center',
     height: 169,
     width: 151
   },
   title: {
     fontSize: 17,
     textAlign: 'center',
     marginTop: 2,
     color: '#FFFFFF'
   },
   subtitle: {
     fontSize: 17,
     textAlign: 'center',
     marginTop: 4,
     color: '#FFFFFF'
   },
   signInButton: {
     height: 50,
     alignSelf: 'stretch',
     backgroundColor: '#D9DADF',
     margin: 10,
     borderRadius: 5,
     justifyContent: 'center',
     alignItems: 'center'
   }
 })

 const mapStateToProps = (state) => {
   return {
     userId: state.login.userId
   }
 }

 const mapDispatchToProps = (dispatch) => {
   return {
     setUserData: (userId, messages, groups, secretMessages, token, loggedIn) => dispatch(LoginActions.setUserData(userId, messages, groups, secretMessages, token, loggedIn))
   }
 }

 export default connect(mapStateToProps, mapDispatchToProps)(WelcomeView)
