import './header.less'
import React from 'react'

export default React.createClass({
  render(){
    return (
      <div className="header-wrap">
        <div className="header-place"></div>
        <div className="header">
          <img className="header-logo" src={require('./logo.png')} />
          <img className="header-search" src={require('./search.png')} />
          <div className="header-title">{this.props.title}</div>
        </div>
      </div>
    )
  }
})
