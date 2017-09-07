import React from 'react'
import Modes from '../../home/modes'
import ajax from 'widget/ajax'
import parseType from 'widget/type'
import appUrl from 'widget/type/appUrl.js'

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
        <img className='m-banner' src={require('./banner-1.jpg')} />
        <Modes modes={this.state.modes}/>
        <a href={appUrl}>
          <img className='m-banner' src={require('./banner2.jpg')} />
        </a>
      </div>
    )
  }
})
