// @flow

import React from 'react'
import { View, Text, ListView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import RoundedButton from '../Components/RoundedButton'
import { Actions as NavigationActions } from 'react-native-router-flux'
import GroupDetailActions from '../Redux/GroupDetailRedux'
import RecipArrActions from '../Redux/RecipArrRedux'

// For empty lists
import AlertMessage from '../Components/AlertMessage'

// Styles
import styles from './Styles/ListviewGridExampleStyle'

class GroupsList extends React.Component {

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
    //   {title: 'All Students', description: 'Slack'},
    //   {title: "HIR's", description: 'Email'},
    //   {title: 'Ricky and Serge', description: 'Text'}
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
      dataSource: ds.cloneWithRows(this.props.groups)
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
      <TouchableOpacity onPress={() => this.clickGroup(rowData)} style={styles.row}>
        <Text style={styles.boldLabel}>{rowData.name}</Text>
        <Text style={styles.label}>{rowData.mediumType}</Text>
      </TouchableOpacity>
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

  // Used for friendly AlertMessage
  // returns true if the dataSource is empty

  componentWillReceiveProps (newProps) {
    if (newProps.groups) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(newProps.groups)
      })
    }
  }

  noRowData () {
    return this.state.dataSource.getRowCount() === 0
  }

  clickGroup (group) {
    console.log('hi jesse= ', group)
    this.props.setGroup(group)
    this.props.setAddRecipArr([])
    this.props.setNewRecipArr([])
    NavigationActions.groupDetails()
  }

  createNewGroup () {
    this.props.setGroup(undefined)
    this.props.setAddRecipArr([])
    this.props.setNewRecipArr([])
    NavigationActions.groupDetails()
  }

  render () {
    return (
      <View style={styles.container}>
        <AlertMessage title='Click The Button Below to Create a group!' show={this.noRowData()} />
        <ListView
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          pageSize={15}
        />
        <RoundedButton onPress={this.createNewGroup.bind(this)}>
           Create New Group
        </RoundedButton>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    groups: state.login.groups
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setGroup: (group) => dispatch(GroupDetailActions.setGroup(group)),
    setNewRecipArr: (newRecipArr) => dispatch(RecipArrActions.setNewRecipArr(newRecipArr)),
    setAddRecipArr: (addRecipArr) => dispatch(RecipArrActions.setAddRecipArr(addRecipArr))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupsList)
