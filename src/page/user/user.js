import common from 'widget/common'
import React from 'react'
import bottom from 'widget/bottom'
import "./user.less"
import login from 'widget/login'

common.createPage(React.createClass({
  getInitialState(){
    return {
      credit:0,
      token:null,
      name:''
    }
  },
  componentDidMount(){
    login.check((result,modules,token)=>{
      if(result){
        this.setState({
          token,
          credit:modules.credit,
          name:modules.name
        })
      }
    })
    bottom.setMenu('user')
  },
  address(){
    var {token} = this.state
    if(token){
      window.location.href='user-address.html'
    }else{
      login.gotoLogin()
    }
  },
  order(){
    var {token} = this.state
    if(token){
      window.location.href='user-order.html'
    }else{
      login.gotoLogin()
    }
  },
  coupon(){
    var{token} = this.state
    if(token){
      window.location.href='user-coupon.html'
    }else{
      login.gotoLogin()
    }
  },
  render(){
    var {credit,token,name} = this.state
    return (
      <div>
        <div className="user-header-wrap">
          {token&&<div className="user-header">
            <img className="user-header-icon" src={require('./icon.png')}/>
            <p className="user-name">{name}</p>
            <p className="user-coupon">鲜在时积分 : {credit}</p>
          </div>}
          {!token&&<div className="user-header">
            <span className="user-noLogin" onClick={e=>login.gotoLogin()}>
              <img src={require('./no-login.png')}/>
              <span>登录</span>
            </span>
          </div>}
        </div>
        <div className="user-list">
          <div className="user-item" onClick={e=>this.address()}>
            <span className="user-icon user-icon-address" />
            <span className="user-text">我的收货地址</span>
            <a className="user-href"/>
          </div>
          <div className="user-item" onClick={e=>this.coupon()}>
            <span className="user-icon user-icon-coupon" />
            <span className="user-text">我的优惠卷</span>
            <a className="user-href"/>
          </div>
          <div className="user-item" onClick={e=>this.order()}>
            <span className="user-icon user-icon-order" />
            <span className="user-text">我的订单</span>
            <a className="user-href"/>
          </div>
        </div>
      </div>
    )
  }
}))
