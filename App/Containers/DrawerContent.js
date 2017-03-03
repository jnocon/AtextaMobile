// @flow

import React, { Component } from 'react'
import { ScrollView, Image, BackAndroid } from 'react-native'
import styles from './Styles/DrawerContentStyle'
import { Images } from '../Themes'
import DrawerButton from '../Components/DrawerButton'
import { Actions as NavigationActions } from 'react-native-router-flux'

class DrawerContent extends Component {

  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.context.drawer.props.open) {
        this.toggleDrawer()
        return true
      }
      return false
    })
  }

  toggleDrawer () {
    this.context.drawer.toggle()
  }

  handlePressMessages = () => {
    this.toggleDrawer()
    NavigationActions.messagesList()
  }

  handlePressGroups = () => {
    this.toggleDrawer()
    NavigationActions.groupsList()
  }

  handlePressSecretMessages = () => {
    this.toggleDrawer()
    NavigationActions.secretMessagesList()
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <Image source={Images.logo} style={styles.logo} />
        <DrawerButton text='Messages' onPress={this.handlePressMessages} />
        <DrawerButton text='Groups' onPress={this.handlePressGroups} />
        <DrawerButton text='Secret Messages' onPress={this.handlePressSecretMessages} />
      </ScrollView>
    )
  }

}

DrawerContent.contextTypes = {
  drawer: React.PropTypes.object
}

export default DrawerContent
