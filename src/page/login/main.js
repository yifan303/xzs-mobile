import common from 'widget/common'
import React from 'react'
import Message from './message'
import Password from './password'

common.createPage(React.createClass({
  getInitialState(){
    return {
      state:1
    }
  },
  render(){
    var {state} = this.state
    if(state===0){
      return <Password onSwitch={e=>this.setState({state:1})}/>
    }else{
      return <Message onSwitch={e=>this.setState({state:0})}/>
    }
  }
}))
