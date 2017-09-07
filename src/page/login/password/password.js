import React from 'react'
import ajax from 'widget/ajax'
import "../login.less"
import message from 'xzs-message'
import {getUrlParam} from 'xzs-util'
import {token} from 'widget/store'
import md5 from 'blueimp-md5'

var urlRedicret = getUrlParam('redicret')?window.unescape(getUrlParam('redicret')):null
var redicretUrl = urlRedicret||window.document.referrer||'home.html'

export default React.createClass({
  getInitialState(){
    return {
      phone:'',
      password:'',
      sending:false
    }
  },
  componentDidMount(){

  },
  submit(e){
    var {phone,password} = this.state
    if(phone===''){
      return message('请输入手机号')
    }
    if(password===''){
      return message('请输入密码')
    }
    this.setState({sending:true})
    var loginTime = +new Date
    var hardwareCode = "359583072058301"
    var sign = md5(`${md5(password)}_${loginTime}_${hardwareCode}`)
    var promise = ajax({
      url:'/requestuser/loginwithpwd',
      method:'post',
      contentType:'application/json',
      data:{
        phone,
        hardwareCode,
        loginTime,
        sign
      }
    })
    promise.then(res=>{
      var result = JSON.parse(res)
      if(result.success){
        message('登录成功,即将跳转')
        token.set(result.module.token)
        window.setTimeout(()=>{
          window.location.href=redicretUrl
        },1000)
      }else{
        message(result.errorMsg)
      }
    })
    promise.always(()=>{
      this.setState({sending:false})
    })
  },
  render(){
    var {phone,password,sending} = this.state
    return (
      <div>
        <img className="login-icon" src={require('../login.jpg')}/>
        <div className="login-form">
          <div className="login-control">
            <label>手机号<span style={{opacity:0}}>占</span></label>
            <input
              value={phone}
              onChange={e=>this.setState({phone:e.target.value})}
              type="number"
              placeholder="输入手机号"
            />
          </div>
          <div className="login-control">
            <label>登录密码</label>
            <input
              value={password}
              type="password"
              onChange={e=>this.setState({password:e.target.value})}
              placeholder="输入密码"
            />
            <a className="login-forget" onClick={e=>(this.props.onSwitch&&this.props.onSwitch())}>忘记密码</a>
          </div>
          {sending&&<a className="login-button">正在登录</a>}
          {!sending&&<a onClick={e=>this.submit(e)} className="login-button">登录</a>}
        </div>
        <a className="login-switch" onClick={e=>(this.props.onSwitch&&this.props.onSwitch())}>通过短信验证码登录</a>
      </div>
    )
  }
})
