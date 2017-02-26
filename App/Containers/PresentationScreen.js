// @flow

import React from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { Images } from '../Themes'
import RoundedButton from '../Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'

// Styles
import styles from './Styles/PresentationScreenStyle'

export default class PresentationScreen extends React.Component {
  render () {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.atextaBG} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.atextaLogo} style={styles.logo} />
          </View>

          <View style={styles.section} >
            <Text style={styles.sectionText} >
              Click either messages or groups to get started or tutorial for an step by step guide.
            </Text>
          </View>

          <RoundedButton onPress={NavigationActions.messagesList}>
           Quick Messages
          </RoundedButton>

          <RoundedButton onPress={NavigationActions.groupsList}>
            Groups
          </RoundedButton>

          <RoundedButton onPress={NavigationActions.secretMessagesList}>
            Secret Messages
          </RoundedButton>

          <View style={styles.centered}>
            <Text style={styles.subtitle}>Made with ❤️ by Dyslexa</Text>
          </View>

        </ScrollView>
      </View>
    )
  }
}
