import React from 'react'
import "./white.less"

export default React.createClass({
  render(){
    return (
      <div>
        <div className="wheader-place"></div>
        <div className="wheader">
          <span className="wheader-text">{this.props.title}</span>
          {this.props.back&&<a className="wheader-back" href={this.props.back}></a>}
        </div>
      </div>
    )
  }
})
