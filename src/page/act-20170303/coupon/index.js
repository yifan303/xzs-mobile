import React from 'react'
import "./coupon.less"
import {token} from 'widget/store'
import Modal from 'widget/login/modal.js'
import message from 'xzs-message'
import login from 'widget/login'
import ajax from 'widget/ajax'
import SimpleModal from 'dwd-modal'
import appUrl from 'widget/type/appUrl.js'

export default React.createClass({
  getInitialState(){
    return {
      phone:'',
      show:false,
      token:'',

      repeatShow:false

    }
  },
  componentDidMount(){

  },
  success(module){
    this.setState({token:module.token},()=>this.getCoupon())
  },
  getCoupon(){
    var {token} = this.state
    var promise = ajax({
      url:'/promotion/addDiscountCoupon',
      method:'get',
      data:{
        type:1,
        couponId:9,
        token
      }
    })
    promise.then(res=>{
      var result = JSON.parse(res)
      if(result.success){
        if(result.errorMsg&&result.errorMsg.indexOf('已拥有')>-1){
          return this.setState({repeatShow:true,show:false})
        }
        window.location.href='act-20170303.html?id=1'
      }else{
        message(result.errorMsg)
      }
    })
  },
  openModal(){
    var {phone,token} = this.state
    if(phone===''){
      return message('请输入手机号')
    }
    this.setState({show:true})
  },
  render(){
    var {phone,show,repeatShow} = this.state
    return (
      <div>
        <img className="banner" src={require('./banner1.png')} />
        <div>
          <input
            className="input"
            value={phone}
            type="text"
            placeholder="输入您的手机号"
            onChange={e=>{
              this.setState({phone:e.target.value})
            }}
          />
        </div>
        <img onClick={e=>this.openModal()} className="banner" src={require('./banner2.png')} />
        <img className="banner" src={require('./banner3.png')} />
        <Modal
          show={show}
          onSuccess={module=>this.success(module)}
          onHide={e=>this.setState({show:false})}
          phone={phone}
        />
        <SimpleModal
          show={repeatShow}
          onHide={e=>this.setState({repeatShow:false})}
          width="8rem"
        >
          <div className="repeat-modal">
            <span onClick={e=>this.setState({repeatShow:false})}>x</span>
            <p>抱歉！此活动仅限新用户参与</p>
            <a href={appUrl}>打开app更多惊喜</a>
          </div>
        </SimpleModal>
      </div>
    )
  }
})
