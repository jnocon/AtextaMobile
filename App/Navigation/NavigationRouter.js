// @flow

import React, { Component } from 'react'
import { Scene, Router } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyle'
import NavigationDrawer from './NavigationDrawer'
import NavItems from './NavItems'
import CustomNavBar from '../Navigation/CustomNavBar'

// screens identified by the router
import PresentationScreen from '../Containers/PresentationScreen'
import AllComponentsScreen from '../Containers/AllComponentsScreen'
import UsageExamplesScreen from '../Containers/UsageExamplesScreen'
import LoginScreen from '../Containers/LoginScreen'
import ListviewExample from '../Containers/ListviewExample'
import ListviewGridExample from '../Containers/ListviewGridExample'
import ListviewSectionsExample from '../Containers/ListviewSectionsExample'
import ListviewSearchingExample from '../Containers/ListviewSearchingExample'
import MapviewExample from '../Containers/MapviewExample'
import APITestingScreen from '../Containers/APITestingScreen'
import ThemeScreen from '../Containers/ThemeScreen'
import DeviceInfoScreen from '../Containers/DeviceInfoScreen'
import GroupsList from '../Containers/GroupsList'
import MessagesList from '../Containers/MessagesList'
import GroupDetails from '../Containers/GroupDetails'
import RecipientDetails from '../Containers/RecipientDetails'
import MessageDetails from '../Containers/MessageDetails'
import SecretMessageDetails from '../Containers/SecretMessageDetails'
import GroupChooseView from '../Containers/GroupChooseView'
import AddressBook from '../Containers/AddressBook'
import SecretMessagesList from '../Containers/SecretMessagesList'

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
            <Scene key='componentExamples' component={AllComponentsScreen} title='Components' />
            <Scene key='usageExamples' component={UsageExamplesScreen} title='Usage' rightTitle='Example' onRight={() => window.alert('Example Pressed')} />
            <Scene key='login' component={LoginScreen} title='Login' hideNavBar />
            <Scene key='listviewExample' component={ListviewExample} title='Listview Example' />
            <Scene key='listviewGridExample' component={ListviewGridExample} title='Listview Grid' />
            <Scene key='listviewSectionsExample' component={ListviewSectionsExample} title='Listview Sections' />
            <Scene key='listviewSearchingExample' component={ListviewSearchingExample} title='Listview Searching' navBar={CustomNavBar} />
            <Scene key='mapviewExample' component={MapviewExample} title='Mapview Example' />
            <Scene key='apiTesting' component={APITestingScreen} title='API Testing' />
            <Scene key='theme' component={ThemeScreen} title='Theme' />
            <Scene key='groupDetails' component={GroupDetails} title='Group Details' />
            <Scene key='recipientDetails' component={RecipientDetails} title='Recipient Details' />
            <Scene key='messageDetails' component={MessageDetails} title='Message Details' />
            <Scene key='secretMessageDetails' component={SecretMessageDetails} title='Secret Message Details' />
            <Scene key='groupChooseView' component={GroupChooseView} title='Choose Group' />
            <Scene key='addressBook' component={AddressBook} title='Address Book' />
            <Scene key='secretMessagesList' component={SecretMessagesList} title='Secret Messages' />


            {/* Custom navigation bar example */}
            <Scene key='deviceInfo' component={DeviceInfoScreen} title='Device Info' />
          </Scene>
        </Scene>
      </Router>
    )
  }
}

