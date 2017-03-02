// @flow

import React from 'react'
import { View, Text, ListView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import RoundedButton from '../Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'

// Styles
import styles from './Styles/ListviewGridExampleStyle'

class SecretGroupView extends React.Component {

  state: {
    dataSource: Object
  }

  constructor (props) {
    super(props)
    /* ***********************************************************
    * STEP 1
    * This is an array of objects with the properties you desire
    * Usually this should come from Redux mapStateToProps
    *************************************************************/
    // const dataObjects = [
    //   {title: 'All Students', description: 'Slack'}
    // ]

    /* ***********************************************************
    * STEP 2
    * Teach datasource how to detect if rows are different
    * Make this function fast!  Perhaps something like:
    *   (r1, r2) => r1.id !== r2.id}
    *************************************************************/
    const rowHasChanged = (r1, r2) => r1 !== r2

    // DataSource configured
    const ds = new ListView.DataSource({rowHasChanged})

    // Datasource is always in state
    this.state = {
      dataSource: ds.cloneWithRows(this.props.message)
    }
  }

  /* ***********************************************************
  * STEP 3
  * `renderRow` function -How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={rowData.title} description={rowData.description} />
  *************************************************************/
  renderRow (rowData) {
    return (
        <View style={styles.row}>
          <Text style={styles.boldLabel}>{rowData.GroupName}</Text>
          <Text style={styles.label}>{rowData.mediumType}</Text>
        </View>
    )
  }

  /* ***********************************************************
  * STEP 4
  * If your datasource is driven by Redux, you'll need to
  * reset it when new data arrives.
  * DO NOT! place `cloneWithRows` inside of render, since render
  * is called very often, and should remain fast!  Just replace
  * state's datasource on newProps.
  *
  * e.g.
    componentWillReceiveProps (newProps) {
      if (newProps.someData) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(newProps.someData)
        })
      }
    }
  *************************************************************/
 componentWillReceiveProps (newProps) {
      if (newProps.message) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(newProps.message)
        })
      }
    }
  // Used for friendly AlertMessage
  // returns true if the dataSource is empty
  noRowData () {
    return this.state.dataSource.getRowCount() === 0
  }

  render () {
    return (
      <View style={styles.container}>
        <ListView
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          pageSize={15}
        />
        <RoundedButton onPress={NavigationActions.groupChooseView}>
           Choose Group
        </RoundedButton>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  let messageArr = [state.secret.message]
  if (!state.secret.message) {
    messageArr = []
  } 
  return {
    message: messageArr
  }
}

export default connect(mapStateToProps)(SecretGroupView)
