import React from 'react'
import "./bottom.less"
import {render} from 'react-dom'

var Bottom = React.createClass({
  getInitialState(){
    return {
      menu:''
    }
  },
  setMenu(menu){
    this.setState({menu})
  },
  render(){
    var {menu} = this.state
    return (
      <div className="bottom">
        <div className="bottom-place"></div>
        <div className="bottom-fixed clearfix">
          <a href="home.html" className={"bottom-port "+(menu==='home'?'bottom-port-select':"")}>
            <span className="bottom-icon bottom-icon-home"></span>
            <span className="bottom-text">首页</span>
          </a>
          <a href="cate.html" className={"bottom-port "+(menu==='cate'?'bottom-port-select':"")}>
            <span className="bottom-icon bottom-icon-cate"></span>
            <span className="bottom-text">分类</span>
          </a>
          {/*外卖先不做*/false&&<a href="/out.html" className={"bottom-port "+(menu==='out'?'bottom-port-select':"")}>
            <span className="bottom-icon bottom-icon-out"></span>
            <span className="bottom-text">外卖</span>
          </a>}
          <a href="cart.html" className={"bottom-port "+(menu==='cart'?'bottom-port-select':"")}>
            <span className="bottom-icon bottom-icon-cart"></span>
            <span className="bottom-text">购物车</span>
          </a>
          <a href="user.html" className={"bottom-port "+(menu==='user'?'bottom-port-select':"")}>
            <span className="bottom-icon bottom-icon-user"></span>
            <span className="bottom-text">我的</span>
          </a>
        </div>
      </div>
    )
  }
})
var bottom = document.getElementById('bottom')
export default render(<Bottom />,bottom)
