// @flow

import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import NavigationRouter from '../Navigation/NavigationRouter'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'
import WelcomeView from './WelcomeView'

// Styles
import styles from './Styles/RootContainerStyle'

class RootContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loggedIn: false
    }
  }

  componentWillReceiveProps (newProps) {
    console.log('thisBeFiring?', newProps)
    this.setState({
      loggedIn: newProps.loggedIn
    })
  }

  componentDidMount () {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }
  }

  render () {
    return (this.state.loggedIn) ? (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <NavigationRouter />
      </View>
    ) : (
      <WelcomeView />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.login.loggedIn
  }
}
// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup())
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
