import React from 'react'
import ajax from 'widget/ajax'
import "../login.less"
const maxTime = 90
import message from 'xzs-message'
import {getUrlParam} from 'xzs-util'
import {token} from 'widget/store'
import hybird from 'xzs-hybird'

var urlRedicret = getUrlParam('redicret')?window.unescape(getUrlParam('redicret')):null
var redicretUrl = urlRedicret||window.document.referrer||'home.html'
var isApp = ()=>(hybird.isAndroid()||hybird.isIos())

export default React.createClass({
  getInitialState(){
    return {
      phone:'',
      code:'',
      sendingTime:maxTime,
      sending:false
    }
  },
  // 发送验证码倒计时
  count(){
    var {sendingTime} = this.state
    var interval = this.interval = window.setInterval(()=>{
      if(sendingTime<=0){
        window.clearInterval(interval)
        this.setState({
          sending:false,
          sendingTime:maxTime
        })
      }else{
        sendingTime--;
        this.setState({sendingTime})
      }
    },1000)
  },
  componentWillUnmount(){
    window.clearInterval(this.interval)
  },
  componentDidMount(){

  },
  getCode(){
    var {phone} = this.state
    if(phone===''){
      return message('手机号不能为空')
    }
    if(phone.length!==11){
      return message('手机号必须为11位')
    }
    this.count()
    var promise = ajax({
      url:'/requestuser/sendcheckcode',
      method:'post',
      data:{
        phone
      }
    })
    promise.then(res=>{
      var result = JSON.parse(res)
      if(result.success){
        message('验证码发送成功')
      }else{
        message(result.errorMsg)
      }
    })
  },
  submit(e){
    var {phone,code} = this.state
    if(phone===''){
      return message('请输入手机号')
    }
    if(code===''){
      return message('请输入验证码')
    }
    this.setState({sending:true})
    var promise = null
    if(isApp()){
      promise = ajax({
        url:'/requestuser/login',
        method:'post',
        data:{
          phone,
          verificationCode:code,
          hardwareCode:"359583072058301"
        }
      })
    }else{
      promise = ajax({
        url:'/requestuser/activitylogin',
        method:'post',
        data:{
          phone,
          verificationCode:code,
          hardwareCode:"359583072058301",
          reuseToken:"true"
        }
      })
    }
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
    var {phone,code,sendingTime,sending} = this.state
    return (
      <div>
        <img className="login-icon" src={require('../login.jpg')}/>
        <div className="login-form">
          <div className="login-control">
            <label>手机号</label>
            <input
              value={phone}
              onChange={e=>this.setState({phone:e.target.value})}
              type="number"
              placeholder="输入手机号"
            />
            {maxTime===sendingTime&&<span onClick={e=>this.getCode()} className="login-code">获取验证码</span>}
            {maxTime!==sendingTime&&<span className="login-code">还剩{sendingTime}秒</span>}
          </div>
          <div className="login-control">
            <label>验证码</label>
            <input
              value={code}
              onChange={e=>this.setState({code:e.target.value})}
              type='text'
              placeholder="输入验证码"
            />
          </div>
          {sending&&<a className="login-button">正在登录</a>}
          {!sending&&<a onClick={e=>this.submit(e)} className="login-button">登录</a>}
        </div>
        <a className="login-switch" onClick={e=>(this.props.onSwitch&&this.props.onSwitch())}>通过密码登录</a>
      </div>
    )
  }
})
