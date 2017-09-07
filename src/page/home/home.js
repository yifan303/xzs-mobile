import bottom from 'widget/bottom'
import common from 'widget/common'
import "./home.less"
import React from 'react'
import ajax from 'widget/ajax_v2'
import Modes from './modes'
import login from 'widget/login'

common.createPage(
  React.createClass({
    getInitialState(){
      return {
        modes:[],
        uid:''
      }
    },
    componentDidMount(){
      bottom.setMenu('home')

      // slide和类目页
      var promise = ajax({
        url:'/requesthome/home',
        method:'post',
        data:{
          pageId:30,
          filterStep:true,
          pageNum:0,
          pageSize:1000,
          version:5,
          device:"h5"
        }
      })
      promise.then(result=>{
        result = JSON.parse(result)
        if(result.success){
          var {modes} = this.state
          this.setState({modes:(result.module||[]).concat(modes)})
        }
      })

      login.check((result,modules)=>{
        if(result){
          this.setState({uid:modules.userId})
        }
      })

    },
    render(){
      var {modes,floors,uid} = this.state
      return (
        <div>
          <Modes modes={modes} uid={uid}/>
        </div>
      )
    }
  })
)
