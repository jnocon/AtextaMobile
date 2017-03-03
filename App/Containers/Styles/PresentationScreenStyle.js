// @flow

import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  logo: {
    height: Metrics.images.logo,
    width: Metrics.images.logo,
    marginTop: 20,
    resizeMode: 'cover'
  },
  centered: {
    alignItems: 'center'
  }
})
