import React from 'react'
import Modal from 'dwd-modal'
import "./modal.less"
const maxTime = 90
import {token} from 'widget/store'
import ajax from 'widget/ajax'
import message from 'xzs-message'

export default React.createClass({
  getInitialState(){
    return {
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
  getCode(){
    var {phone} = this.props
    if(phone===''){
      return message('手机号不能为空')
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
    var {code} = this.state
    var {phone,onSuccess} = this.props
    if(phone===''){
      return message('请输入手机号')
    }
    if(code===''){
      return message('请输入验证码')
    }
    this.setState({sending:true})
    var promise = ajax({
      url:'/requestuser/login',
      method:'post',
      data:{
        phone,
        verificationCode:code,
        hardwareCode:"359583072058301"
      }
    })
    promise.then(res=>{
      var result = JSON.parse(res)
      if(result.success){
        token.set(result.module.token)
        onSuccess&&onSuccess(result.module)
      }else{
        message(result.errorMsg)
      }
    })
    promise.always(()=>{
      this.setState({sending:false})
    })
  },
  render(){
    var {show,onHide} = this.props
    var {sending,sendingTime,code} = this.state
    return (
      <Modal show={show} width="8rem" onHide={onHide}>
        <div>
          <div className="modal-header">
            <h3>手机号码验证</h3>
            <h4>为保证领取成功，请验证您的手机号码</h4>
            <span onClick={onHide}>x</span>
          </div>
          <div className="modal-body">
            <input value={code} onChange={e=>this.setState({code:e.target.value})} type="number" placeholder="输入验证码"/>
            {maxTime===sendingTime&&<span onClick={e=>this.getCode()}>获取验证码</span>}
            {maxTime!==sendingTime&&<span>还剩{sendingTime}秒</span>}
            {!sending&&<a onClick={e=>this.submit(e)}>提交</a>}
            {sending&&<a>正在提交</a>}
          </div>
          <div className="modal-footer">
            温馨提示：未注册鲜在时帐号的手机号，登录时将自动注册鲜在时帐号，且代表您已同意<a href="protocol.html">{'<<鲜在时用户协议>>'}</a>
          </div>
        </div>
      </Modal>
    )
  }
})
