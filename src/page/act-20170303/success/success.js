import React from 'react'
import Modes from '../../home/modes'
import ajax from 'widget/ajax'
import parseType from 'widget/type'
import appUrl from 'widget/type/appUrl.js'
import {isApp} from 'widget/store'

export default React.createClass({
  getInitialState(){
    return {
      modes:[]
    }
  },
  componentDidMount(){
    var promise = ajax({
      url:'/requesthome/homepage',
      method:'post',
      online:true,
      data:{
        pageId:"30",
        hasAllFloor:"false",
        version:"1",
        device:"h5"
      }
    })
    promise.then(result=>{
      result = JSON.parse(result)
      if(result.success){
        this.setState({modes:result.module.filter((mode=>{
          return parseType(mode.stepType) === 'banner'
        }))})
      }
    })
  },
  render(){
    return (
      <div>
        <img className='m-banner' src={require('./banner1.png')} />
        <Modes modes={this.state.modes}/>
        {!isApp()&&(
          <a href={appUrl}>
            <img className='m-banner' src={require('./banner2.png')} />
          </a>
        )}
      </div>
    )
  }
})
