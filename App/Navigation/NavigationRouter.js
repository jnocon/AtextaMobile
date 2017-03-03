// @flow

import React, { Component } from 'react'
import { Scene, Router } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyle'
import NavigationDrawer from './NavigationDrawer'
import NavItems from './NavItems'
import CustomNavBar from '../Navigation/CustomNavBar'

// screens identified by the router
import PresentationScreen from '../Containers/PresentationScreen'
import GroupsList from '../Containers/GroupsList'
import MessagesList from '../Containers/MessagesList'
import GroupDetails from '../Containers/GroupDetails'
import RecipientDetails from '../Containers/RecipientDetails'
import MessageDetails from '../Containers/MessageDetails'
import SecretMessageDetails from '../Containers/SecretMessageDetails'
import GroupChooseView from '../Containers/GroupChooseView'
import AddressBook from '../Containers/AddressBook'
import SecretMessagesList from '../Containers/SecretMessagesList'
import SecretGroupChooseView from '../Containers/SecretGroupChooseView'

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

export default class NavigationRouter extends Component {
  render () {
    return (
      <Router>
        <Scene key='drawer' component={NavigationDrawer} open={false}>
          <Scene key='drawerChildrenWrapper' navigationBarStyle={Styles.navBar} titleStyle={Styles.title} leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>
            <Scene initial key='presentationScreen' component={PresentationScreen} title='Atexta' />
            <Scene key='groupsList' component={GroupsList} title='Groups' />
            <Scene key='messagesList' component={MessagesList} title='Quick Messages' />
            <Scene key='groupDetails' component={GroupDetails} title='Group Details' />
            <Scene key='recipientDetails' component={RecipientDetails} title='Recipient Details' />
            <Scene key='messageDetails' component={MessageDetails} title='Message Details' />
            <Scene key='secretMessageDetails' component={SecretMessageDetails} title='Secret Message Details' />
            <Scene key='groupChooseView' component={GroupChooseView} title='Choose Group' />
            <Scene key='secretGroupChooseView' component={SecretGroupChooseView} title='Choose Secret Group' />
            <Scene key='addressBook' component={AddressBook} title='Address Book' />
            <Scene key='secretMessagesList' component={SecretMessagesList} title='Secret Messages' />
          </Scene>
        </Scene>
      </Router>
    )
  }
}

