 import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux'
import LoginActions from '../Redux/AuthRedux'

import { Actions as NavigationActions } from 'react-native-router-flux'

import Auth0Lock from 'react-native-lock';

class WelcomeView extends Component {
  constructor(props) {
  super(props) 

}

componentWillReceiveProps = (nextProps) => {

  if (nextProps.userId) {
        NavigationActions.presentationScreen()
      }
}

_onLogin = () => {
  var context = this;
  let lock = new Auth0Lock({
  clientId: "HFYDMTRU6gcORtnREZaFudRLO0f1FSwM",
  domain: "rakan.auth0.com"
})
  console.log('here?', lock)
    lock.show({
      closable: true
    }, (err, profile, token) => {
      if (err) {
        console.log(err);
        return;
      }
    context.getUserId(token.accessToken)
    .then(result => result.json())
    .then(result => {
      context.props.setUserId(result)
    })
    .catch(error => {
      console.log('error in user result = ', error)
    })
    });
  }

  getUserId = (token) => {
      return fetch('http://192.168.1.227:3000/auth/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'token': token})
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.messageBox}>
          <Text style={styles.title}>Welcome To Atexta</Text>
          <Text style={styles.subtitle}>Login With Your Amazon Account to Continue</Text>
        </View>
        <TouchableOpacity
          style={styles.signInButton}
          underlayColor='#949494'
          onPress={this._onLogin}>
          <Text>Log In</Text>
        </TouchableOpacity>
      </View>
    );
  };

}



var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#15204C',
  },
  messageBox: {
    flex: 1,
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'center',
    height: 169,
    width: 151,
  },
  title: {
    fontSize: 17,
    textAlign: 'center',
    marginTop: 8,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    marginTop: 4,
    color: '#FFFFFF',
  },
  signInButton: {
    height: 50,
    alignSelf: 'stretch',
    backgroundColor: '#D9DADF',
    margin: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    userId: state.login.userId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
   setUserId: userId => dispatch(LoginActions.setUserId(userId))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(WelcomeView)
