import common from 'widget/common'
import React from 'react'
import List from './list'
import Detail from './detail'
import login from 'widget/login'
import {getUrlParam} from 'xzs-util'

var id = getUrlParam('id')

common.createPage(React.createClass({
  getInitialState(){
    return {
      uid:null
    }
  },
  componentDidMount(){
    login.check((result,modules)=>{
      if(result){
        this.setState({uid:modules.userId})
      }else{
        login.gotoLogin()
      }
    })
  },
  render(){
    var {uid} = this.state
    if(!uid){
      return <div />
    }
    if(id){
      return <Detail uid={uid} id={id}/>
    }
    return <List uid={uid} />
  }
}))
